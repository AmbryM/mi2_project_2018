var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');

app.get('/', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/style', express.static(path.join(__dirname + '/style')));

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/about",function(req,res){
  res.sendFile(__dirname + '/views/creation.html');
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(__dirname + "/public/404.html");
});

app.use("/api",router);

app.listen(8080);
