var express = require("express");
var router = express.Router();

router.get('/',function(req,res,next){
	// res.send('<h1>This is main Page</h1>\
			  // <a href="/soap">Go to the Soap Project</a>');
	   res.render("Soap_entrance");
});

module.exports = router ; 