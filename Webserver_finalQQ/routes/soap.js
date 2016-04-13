var express = require("express");
var elastic = require("../tools/elastic_tool");
var fs = require("fs");
var soap = express.Router();

soap.get("/",function(req,res,next){
		// res.render("SoapQQ",{"QQQQQ":"This is a book."});
		res.render("SoapQQ");
});

soap.post("/testQQ" , function(req,res,next){
	var ip = (req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"] || '').split(",")[0] || req.connection.remoteAddress;
	
	var client = {
		"_ip" :  ip,
		"search_time" : new Date() ,
		"detail" : req.body
		
	}

	console.log(client);
	console.log('======================================================================');
	fs.appendFile("SearchQQ.txt",client["_ip"] + ',' + client["detail"]["keyword"] + ' | ');
	// console.log(req);
	// connect elasticsearch
	// if(!req.body["index_source[]"]){
		// res.json(new Error('QQ'));
	// }
	
	elastic.searchQQ(req.body).then(function(result){ 
		// res.json(result["hits"]["hits"]);
		res.json(result);
	});
	
})
 
module.exports = soap;