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

//AE params
var aeId = "Cae-monitor1";
var monitorIp = "localhost";
var monitorPort = 1400;

var lumMean = 0; // mean for luminosity on 4 hours
var  i = 0;

var date = new Date();
var hour = date.getHours();
var curPeriod = 0; //current period in the day, there are 4 periods : 1, 2, 3, 4
var prevPeriod = 0; //previous period in the day

//////////////////////////////////////////



init();
/////////////////////////////////////////

app.use(bodyParser.json());
app.listen(monitorPort, function () {
	console.log("Monitor listening on: "+monitorIp+":"+monitorPort);
});

var ledON = false;
app.post('/', function (req, res) {
	console.log("\n◀◀◀◀◀")
	console.log(req.body["m2m:sgn"]["m2m:nev"]["m2m:rep"]["m2m:cin"]["con"]);
	var content = req.body["m2m:sgn"]["m2m:nev"]["m2m:rep"]["m2m:cin"]["con"];
	content=content.split(" ")[2].split(",")[0];
	console.log(date.getHours());

	//createContenInstance(content, "LUMINOSITY_SENSOR", "DATA");

	hour = date.getHours();
	content = "{value : "+content+", unit : lux , location : home , period : "+ curPeriod+" , day : "+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+"}"
	
	createContenInstance(content, "LUMINOSITY_SENSOR", "DATA");


	if(hour<6){
		curPeriod=1;


	}else if(hour<12){
		curPeriod=2;


	}else if(hour<18){
		curPeriod=3;


	}else if(hour<24){
		curPeriod=4;


	}

	if (curPeriod!=prevPeriod && lumMean!=0) {


		lumMean=lumMean+parseInt(content);
		i=i+1;
		lumMean=lumMean/i;

		content = "{value : "+lumMean+"unit : lux, location : home, period : "+ curPeriod+" day : "+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+"}"
	
		createContenInstance(content, "LUMINOSITY_SENSOR", "DATA");
		lumMean=0;
		i=0;




	}else{

		lumMean=lumMean+parseInt(content);
		i=i+1;


	}


prevPeriod=curPeriod;


	
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

function createAE(AEname){
	console.log("\n▶▶▶▶▶");
	var method = "POST";
	var uri= inURI+"/~/in-cse";
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


function createCNT(AEname, CNTname){
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
			createContenInstance("{location : home, unit : lux}", "LUMINOSITY_SENSOR", CNTname);
		}
			//createSubscription();
		}
	});
}


/*function createSubscription(){
	console.log("\n▶▶▶▶▶");
	var method = "POST";
	var uri= cseUri+"/server/mydevice1/luminosity";
	var resourceType=23;
	var requestId = "123456";
	var representation = {
		"m2m:sub": {
			"rn": "subMonitor",
			"nu": ["Cae-monitor1"],
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
			"X-M2M-Origin": aeId,
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
}*/

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


function init(){


	console.log("\n▶▶▶▶▶");
	var method = "POST";
	var uri= inURI+"/~/in-cse";
	var resourceType=2;
	var requestId = "123456";
	var representation = {
		"m2m:ae":{
			"rn":"LUMINOSITY_SENSOR",			
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
			createCNT("LUMINOSITY_SENSOR","DESCRIPTOR");
			createCNT("LUMINOSITY_SENSOR","DATA");

			//createSubscription();
		}
	});



}