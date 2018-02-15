var express = require('express');
var app = express();
var path = require('path');

app.get('/', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.sendFile(path.join(__dirname + '/index.html'));
})
.use('/style', express.static(path.join(__dirname + '/style')))
.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

app.listen(8080);