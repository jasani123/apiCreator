'use strict';
console.log('inside api.js');
//var metamodels = require('../models/metamodels.js');
//var models = metamodels();
var express = require('express');
var restful = require('node-restful');
var fs = require('fs');
var mongoose = restful.mongoose;
var router = express.Router();
//var schemas = models.modules;
//var schema= metamodels;
var Q=require('q');

var os = require('os');
var ifaces = os.networkInterfaces();
var metadata = require('node-ec2-metadata');
var mongooseschema = [];
var restfulmodel = [];
var Slack = require('slack-node');
var webhookUri = "https://hooks.slack.com/services/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";


var fs = require('fs');
var contents = fs.readFileSync("/usr/share/api-creator/config.json");
var config = JSON.parse(contents);
var ACCESS = config.accessKeyId;
var SECRET = config.secretAccessKey;
var BUCKET = config.bucket;
var HOST = config.host;
var PORT = config.port;
var GITHUB = config.github;


var logger = require('fluent-logger')
logger.configure('apicreator', {
    host: HOST,
    port: PORT,
    timeout: 3.0,
    reconnectInterval: 600000 // 10 minutes
});



fs.readFile('api-creator-master/models/metamodels.json', 'utf8', function (err, data) {
    if (err) throw err;
    var obj = JSON.parse(data);
   // console.log(data);

    for (var i = 0; i < obj.metamodels.length; ++i) {
        console.log("This is inside API.js",obj.metamodels[i].ModelName);
        console.log("----------------------------------------");
    }
	
    for(var i=0;i< obj.metamodels.length; i++){
		
        console.log ('creating api : ' + obj.metamodels[i].ModelName);
		console.log(obj.metamodels[i]);
		console.log('--------Amazon instance details ----------------------------');
		console.log ('Instance Id and IP address');
		
		metadata.getMetadataForInstance('instance-id')
		.then(function(instanceId) {
			console.log("Instance ID: " + instanceId);
		})
		.fail(function(error) {
			console.log("Error: " + error);
		});
				
		var str=obj.metamodels[i].ModelName;
		Q.all([
			metadata.getMetadataForInstance('ami-id'),
			metadata.getMetadataForInstance('hostname'),
			metadata.getMetadataForInstance('public-hostname'),
			metadata.getMetadataForInstance('public-ipv4'),
		])
		.spread(function(amiID, hostname, publicHostname, publicIPv4) {
			console.log("AMI-ID: " + amiID);
			console.log("Hostname: " + hostname);
			console.log("Public Hostname: " + publicHostname);
			console.log("Public IPv4: " + publicIPv4);
			console.log("API's are available at("+hostname+")... Visit http://"+publicIPv4+":3000/api/"+str);
			logger.emit('creator', {message: 'APIs are available at('+publicIPv4+') ...Visit http://'+publicIPv4+':3000/api/'+str});
		})
		.fail(function(error) {
			console.log("Error: " + error);
		});
			
		//  console.log ('creating api defination: ' + obj.metamodels[i].defination);
            mongooseschema[i] = new mongoose.Schema(obj.metamodels[i].defination);
			restfulmodel[i] = restful.model(obj.metamodels[i].ModelName, mongooseschema[i])
            .methods(['get','post','put','delete'])
            .register(router,'/' + obj.metamodels[i].ModelName);
           // .register(router,'/' + obj.metamodels[i].ModelName/);
    }

});



//set up the api
/*
for(var i=0; i<schemas.length; i++){
	console.log ('creating api: ' + schemas[i].modelname);
	mongooseschema[i] = new mongoose.Schema(schemas[i].definition);
	restfulmodel[i] = restful.model(schemas[i].modelname, mongooseschema[i])
		.methods(['get','post','put','delete'])
		.register(router,'/' + schemas[i].modelname);
}*/

module.exports = router;




/*
		console.log ('------------------------------Local Machine-------------------------------');		
		Object.keys(ifaces).forEach(function (ifname) {
		  var alias = 0;
		  ifaces[ifname].forEach(function (iface) {
			if ('IPv4' !== iface.family || iface.internal !== false) 
			{
			  // i.e. 127.0.0.1) 
			  return;
			}
			if (alias >= 1) {
			  // this single interface has multiple ipv4 addresses
			  //console.log(ifname + ':' + alias, iface.address);
			  console.log("API's are available at ... Visit http://"+iface.address+":3000/api/"+obj.metamodels[i].ModelName);
			  logger.emit('creator', {message: 'APIs are available at('+ ifname+') ...Visit http://'+iface.address+':3000/api/'+obj.metamodels[i].ModelName});
			  
			} else {
			  // this interface has ipv4 adress
			  //console.log(ifname, iface.address);
			  //console.log("API's are available at ... Visit http://localhost:3000/api/"+obj.metamodels[i].ModelName +iface.address);
			  console.log("API's are available at("+ifname+")... Visit http://"+iface.address+":3000/api/"+obj.metamodels[i].ModelName);
			  logger.emit('creator', {message: 'APIs are available at('+ ifname+') ...Visit http://'+iface.address+':3000/api/'+obj.metamodels[i].ModelName});
			}
			++alias;
		  });
		});
		
        //console.log("API's are available at ... Visit http://localhost:3000/api/"+obj.metamodels[i].ModelName +iface.address);
		//logger.emit('creator', {message: 'successfully created APIs..Visit http://localhost:3000/api/'+obj.metamodels[i].ModelName});	
		 /*code for sendding slack message on #api-creator channel
		var str1 ="API Creator running successfully ..Visit http://localhost:3000/api/";
		var str2 =obj.metamodels[i].ModelName;
		var msg= str1.concat(str2);
		
		var slack = new Slack();
		slack.setWebhook(webhookUri);
		slack.webhook({
				channel: "#api-creator",
				username: "securitybot", //neha main user
				text: msg
			}, function(err, response) {
				console.log(response);
			});*/