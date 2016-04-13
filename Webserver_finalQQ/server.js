var express = require('express');
var hbs = require("hbs");
var app = express();

// Import Modules
var path = require("path");
var cookieSession = require("cookie-session");
var bodyParser = require("body-parser");

// Setting Routers
var router = require("./routes/index");
var users = require("./routes/users");
var soap = require("./routes/soap");

// New Template Engine
app.engine('html',hbs.__express);

// Setting static files
app.use(express.static(path.join(__dirname , '/public')));

// Setting View engine & View dir
app.set("views" , path.join(__dirname , "views"));
app.set("view engine" , "html");

// Setting Middleware
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended:false} ) );

// Use CookieSession
app.use(cookieSession({
	key : "node",
	secret : "HiHiImtestQQ"	
}));


// Use Routers
app.use('/' , router);
app.use('/soap' , soap);
//app.use('/users',users);

app.listen(32767,function(){
	console.log("Server is running at : localhost:32767");

});

