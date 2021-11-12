var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var fs = require('fs');

///////////////Parameters/////////////////
//CSE Params
var mnURI = "http://localhost:8282"; //mn port on the gateway
var inURI = "http://localhost:8080"; 
var sensorIP="";


//To change regarding the configuration. IP and port on the gateway, the raspberry. 
var monitorIp="localhost";
var monitorPort=1400;

//Mean values of sensors : 
//Luminosity, humidity, water consumption, height, temperature
var sensorsMean=[0, 0, 0, 0, 0];

//To compute mean values
var sensorsCounter = [0, 0, 0, 0, 0];

var curSensor = -1;

var date = new Date();
var hour = date.getHours();
var prevHour = 0; //previous period in the day. Here periods are hours

var value=0;

//To find the nature of the value sent by the ESP
var sensor_type="";
var start=0;
var end=0;

//////////////////////////////////////////


//Create AE SENSOR_PLATFORM in the IN node (server). This is to this AE that data collected from ESP32 will be transmitted
initSensorPlatform();


/////////////////////////////////////////

app.use(bodyParser.json());

//To receive request from the MN-CSE as soon as a new content instance is published on the mn-node. Data come from several sensors : lumonisity, humidity, temperature etc... 
//We have one request for one sensor. For each request we have to know sensor type. 
app.listen(monitorPort, function () {
	console.log("Monitor listening on: "+monitorIp+":"+monitorPort);
});

app.post('/', function (req, res) {
	console.log("\n◀◀◀◀◀")
	console.log(req.body);


	//Extract the request content
	console.log(req.body["m2m:sgn"]["m2m:nev"]["m2m:rep"]["m2m:cin"]["con"]);
	var content = req.body["m2m:sgn"]["m2m:nev"]["m2m:rep"]["m2m:cin"]["con"];

	start=content.indexOf("sensor");
	end=content.indexOf(",", start);

	//extract the type of sensor
	sensor_type=content.substring(start+9, end);


	//extract the value measured by a sensor
	value=content.substring(content.indexOf("value")+8, content.indexOf(","));
	
	switch(sensor_type){
		case "luminosity":
			curSensor=0;
			break;
		case "humidity":
			curSensor=1;
			break;
		case "waterFlow":
			curSensor=2;
			break;
		case "height":
			curSensor=3;
			break;
		case "temperature":
			curSensor=4;
			break;
	}



	date=new Date();
	hour = date.getHours();


	// If one hour has passed
	if (hour!==prevHour && sensorsMean.reduce(function(pv, cv) { return pv + parseInt(cv); }, 0)!==0){



		sensorsMean[curSensor]=sensorsMean[curSensor]+parseInt(value);
		sensorsCounter[curSensor]=sensorsCounter[curSensor]+1;


		for(let i=0; i<5; i++){

			//We compute the mean of each value (luminosity, temperature etc...) before send them to the IN. We think that the mean over one hour is releavant, but we can add other features like 
			//the max or/and min value over one hour or real time data. We don't want to clog up the network and reduce device consumption. That's what we want to send as 
			//little data as possible between the gateway and the server while keeping a maximum of information mon crop's environment. 
			sensorsMean[i]=sensorsMean[i]/sensorsCounter[i];
		}
        
        //We concatenate means of data sensors over one hour to send them to the IN node
        content = "{luminosity : "+sensorsMean[0]+", humidity : "+sensorsMean[1]+", water_consumption : "+sensorsMean[2]+", height : "+sensorsMean[3]+", temperature : "+sensorsMean[4]+", period : "+ prevHour+" ,day : "+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+ "}";

		
        //Content instance is created on the IN node
		createContenInstance(content, "SENSOR_PLATFORM", "DATA");
		
		sensorsMean.forEach((element, index) => {sensorsMean[index]=0;});
		sensorsCounter.forEach((element, index) => {sensorsCounter[index]=0;});
		




	}else{

		//If one hour hasn't passed we add current value to the previous and increment the counter to compute the mean later (every one hour)
		sensorsMean[curSensor]=sensorsMean[curSensor]+parseInt(value);
		sensorsCounter[curSensor]=sensorsCounter[curSensor]+1;


	}

	prevHour=hour;
	res.sendStatus(200);
});

function createAE(AEname, URI){
	console.log("\n▶▶▶▶▶");
	var method = "POST";
	var uri= URI;
	var resourceType=2;
	var requestId = "123456";
	var representation = {
		"m2m:ae":{
			"rn":AEname,			
			"rr":"true",
			"api":"app.company.com"
		}
	};

	console.log(method+" "+uri);
	console.log(representation);

	var options = {
		uri: uri,
		method: method,
		headers: {
			"X-M2M-Origin": "admin:admin",
			"X-M2M-RI": requestId,
			"Content-Type": "application/json;ty="+resourceType
		},
		json: representation
	};

	request(options, function (error, response, body) {
		console.log("◀◀◀◀◀");
		if(error){
			console.log(error);
		}else{
			console.log(response.statusCode);
			console.log(body);
			//createSubscription();
		}
	});
}


function createCNT(AEname, CNTname, descriptor_content){
	


	console.log("\n▶▶▶▶▶");
	var method = "POST";
	var uri= inURI+"/~/in-cse/in-name/"+AEname;
	var resourceType=3;
	var requestId = "123456";
	var representation = {
		"m2m:cnt":{
			"rn":CNTname,			
			"rr":"true"
		}
	};

	console.log(method+" "+uri);
	console.log(representation);

	var options = {
		uri: uri,
		method: method,
		headers: {
			"X-M2M-Origin": "admin:admin",
			"X-M2M-RI": requestId,
			"Content-Type": "application/json;ty="+resourceType
		},
		json: representation
	};

	request(options, function (error, response, body) {
		console.log("◀◀◀◀◀");
		if(error){
			console.log(error);
		}else{
			console.log(response.statusCode);
			console.log(body);
			if(CNTname=="DESCRIPTOR"){
			createContenInstance(descriptor_content, "SENSOR_PLATFORM", CNTname);
		}
			//createSubscription();
		}
	});
}


function createSubscription(ae, cnt){
	console.log("\n▶▶▶▶▶");
	var method = "POST";
	var uri= inURI+"/~/in-cse/in-name/"+ae+"/"+cnt;
	var resourceType=23;
	var requestId = "123456";
	var representation = {
		"m2m:sub": {
			"rn": "subWaterManagement",
			"nu": ["http://127.0.0.1:8080/~/mn-cse/mn-name/WATER_MANAGEMENT_GW"],
			"nct": 2,
			"enc": {
				"net": 3
			}
		}
	};

	console.log(method+" "+uri);
	console.log(representation);

	var options = {
		uri: uri,
		method: method,
		headers: {
			"X-M2M-Origin": "admin:admin",
			"X-M2M-RI": requestId,
			"Content-Type": "application/json;ty="+resourceType
		},
		json: representation
	};

	request(options, function (error, response, body) {
		console.log("◀◀◀◀◀");
		if(error){
			console.log(error);
		}else{
			console.log(response.statusCode);
			console.log(body);
		}
	});
}

function createContenInstance(value, ae, cnt){
	console.log("\n▶▶▶▶▶");
	var method = "POST";
	var uri= inURI+"/~/in-cse/in-name/"+ae+"/"+cnt;
	var resourceType=4;
	var requestId = "123456";
	var representation = {
		"m2m:cin":{
				"con": value
			}
		};

	console.log(representation);

	var options = {
		uri: uri,
		method: method,
		headers: {
			"X-M2M-Origin": "admin:admin",
			"X-M2M-RI": requestId,
			"Content-Type": "application/json;ty="+resourceType
		},
		json: representation
	};

	request(options, function (error, response, body) {
		console.log("◀◀◀◀◀");
		if(error){
			console.log(error);
		}else{
			console.log(response.statusCode);
			console.log(body);
		}
	});
}


function initSensorPlatform(){


	console.log("\n▶▶▶▶▶");
	var method = "POST";
	var uri= inURI+"/~/in-cse";
	var resourceType=2;
	var requestId = "123456";
	var representation = {
		"m2m:ae":{
			"rn":"SENSOR_PLATFORM",			
			"rr":"true",
			"api":"app.company.com"
		}
	};

	console.log(method+" "+uri);
	console.log(representation);

	var options = {
		uri: uri,
		method: method,
		headers: {
			"X-M2M-Origin": "admin:admin",
			"X-M2M-RI": requestId,
			"Content-Type": "application/json;ty="+resourceType
		},
		json: representation
	};

	//Create the AE SENSOR_PLATFORM on the IN node (server)
	request(options, function (error, response, body) {
		console.log("◀◀◀◀◀");
		if(error){
			console.log(error);
		}else{
			console.log(response.statusCode);
			console.log(body);
			createCNT("SENSOR_PLATFORM","DESCRIPTOR","{location : [latidude, longitude], crops/plants : cotton, sensors : [luminosity (lux), temperature (°C), humidity (%), water consumption (L),  height (cm)]}");
			createCNT("SENSOR_PLATFORM","DATA");
		}
	});

}

//function initWaterActuator(){


// console.log("\n▶▶▶▶▶");
// 	var method = "POST";
// 	var uri= "http://localhost:8282/~/mn-cse/mn-name";
// 	var resourceType=2;
// 	var requestId = "123456";
// 	var representation = {
// 		"m2m:ae":{
// 			"rn":"WATER_MANAGEMENT_GW",			
// 			"rr":"true",
// 			"poa":"http://"+sensorIP+":9999/",
// 			"api":"api"
// 		}
// 	};

// 	console.log(method+" "+uri);
// 	console.log(representation);

// 	var options = {
// 		uri: uri,
// 		method: method,
// 		headers: {
// 			"X-M2M-Origin": "admin:admin",
// 			"X-M2M-RI": requestId,
// 			"Content-Type": "application/json;ty="+resourceType
// 		},
// 		json: representation
// 	};

// 	request(options, function (error, response, body) {
// 		console.log("◀◀◀◀◀");
// 		if(error){
// 			console.log(error);
// 		}else{
// 			console.log(response.statusCode);
// 			console.log(body);
// 			createSubscription("WATER_ACTUATOR", "DATA");
// 		}
// 	});

	
// }