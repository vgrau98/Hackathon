var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var fs = require('fs');

///////////////Parameters/////////////////
//CSE Params
var mnURI = "http://localhost:8282"; //port du mn sur la gateway
var inURI = "http://localhost:8080"; 
var sensorIP="";

//AE params
var aeId = "Cae-monitor1";
var monitorIp = "localhost";
var monitorPort = 1400;

var lumMean = 0; // mean for luminosity on 1 hours
var humMean = 0;
var waterFlow=0;
var heightMean=0;
var temperatureMean=0;

//Mean values of sensors : 
//Luminosity, humidity, water consoumption, height, temperature
var sensorsMean=[0, 0, 0, 0, 0];

//To compute mean values
var sensorsCounter = [0, 0, 0, 0, 0];

var curSensor = -1;

var  i = 0;

var date = new Date();
var hour = date.getHours();
var prevHour = 0; //previous period in the day

var value=0;

//To find the nature of the value sent by the ESP
var sensor_type="";
var start=0;
var end=0;

//////////////////////////////////////////



initSensorPlatform();


/////////////////////////////////////////

app.use(bodyParser.json());
app.listen(monitorPort, function () {
	console.log("Monitor listening on: "+monitorIp+":"+monitorPort);
});

app.post('/', function (req, res) {
	console.log("\n◀◀◀◀◀")
	console.log(req.body);
	console.log(req.body["m2m:sgn"]["m2m:nev"]["m2m:rep"]["m2m:cin"]["con"]);
	var content = req.body["m2m:sgn"]["m2m:nev"]["m2m:rep"]["m2m:cin"]["con"];

	start=content.indexOf("sensor");
	end=content.indexOf(",", start);
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

	//content = "{value : "+content+", unit : lux , location : home , period : "+ hour+" , day : "+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+"}"
	//createContenInstance(content, "LUMINOSITY_SENSOR", "DATA");



	//After one hour, we compute each mean and send them to IN
	//if (hour!==prevHour && sensorsMean!==0) {

	if (hour!==prevHour && sensorsMean.reduce(function(pv, cv) { return pv + parseInt(cv); }, 0)!==0){

		sensorsMean[curSensor]=sensorsMean[curSensor]+parseInt(value);
		sensorsCounter[curSensor]=sensorsCounter[curSensor]+1;

		//lumMean=lumMean+parseInt(value);
		//i=i+1;
		//lumMean=lumMean/i;

		for(let i=0; i<5; i++){

			sensorsMean[i]=sensorsMean[i]/sensorsCounter[i];
		}
        
        //Multiply water_flow by its time unit to have water consumption over one hour
        content = "{luminosity : "+sensorsMean[0]+", humidity : "+sensorsMean[1]+", water_consumption : "+sensorsMean[2]+", height : "+sensorsMean[3]+", temperature : "+sensorsMean[4]+", period : "+ prevHour+" ,day : "+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+ "}";
		//content = "{value : "+lumMean+"unit : lux, location : home, period : "+ hour+" day : "+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+"}";

		createContenInstance(content, "SENSOR_PLATFORM", "DATA");
		
		sensorsMean.forEach((element, index) => {sensorsMean[index]=0;});
		sensorsCounter.forEach((element, index) => {sensorsCounter[index]=0;});
		//lumMean=0;
		//i=0;




	}else{

		sensorsMean[curSensor]=sensorsMean[curSensor]+parseInt(value);
		sensorsCounter[curSensor]=sensorsCounter[curSensor]+1;

		//lumMean=lumMean+parseInt(value);
		//i=i+1;


	}

	console.log(sensorsMean[0]);
	//console.log(prevHour);
	prevHour=hour;



	
	/*s.writeFile("test.txt", content,{ flag: 'a+' }, function(err) {
    if (err) {
        console.log(err);
    	}
	});*/

	/*if(content>300 && ledON ){
		console.log("High luminosity => Switch led OFF");
		createContenInstance("OFF");
		ledON=false;
	}else if(content<=300 && !ledON){
		console.log("Low luminosity => Switch led ON");
		createContenInstance("ON")
		ledON=true;
	}else{
		console.log("Nothing to do");
	}*/
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
			//"poa":"http://localhost:1400/"
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
			createCNT("SENSOR_PLATFORM","DESCRIPTOR","{location : home, sensors : [luminosity (lux), temperature (°C), humidity (%), water consumption (L)]}, height (cm)");
			createCNT("SENSOR_PLATFORM","DATA");

			//createSubscription();
		}
	});

}

function initWaterActuator(){


console.log("\n▶▶▶▶▶");
	var method = "POST";
	var uri= "http://localhost:8282/~/mn-cse/mn-name";
	var resourceType=2;
	var requestId = "123456";
	var representation = {
		"m2m:ae":{
			"rn":"WATER_MANAGEMENT_GW",			
			"rr":"true",
			"poa":"http://"+sensorIP+":9999/",
			"api":"api"
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
			createSubscription("WATER_ACTUATOR", "DATA");
		}
	});

	
}