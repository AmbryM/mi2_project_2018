/**
*
* VARIABLES
*
**/
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');

var mysql = require('mysql');


//Connexion BD
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'projet_web_dynamique'
});

connection.connect(function(err){
    if(err){
        console.log("Connexion échouée");
    }else{
        console.log("Connexion réussi");
    }
});

/**
*
* CORPS
*
**/

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use('/style', express.static(path.join(__dirname + '/style')));
app.get('/', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.sendFile(path.join(__dirname + '/index.html'));
});
/**
*
* ROUTES
*
**/

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/questionnaire/creation",function(req,res){
  res.render('creation.ejs');
});

router.get("/liste",function(req,res){
  res.render('liste.ejs');
});

router.get("/questionnaire/:idQuestionnaire/lobby",function(req,res){
  var params = {};
  params.idQuestionnaire = req.params.idQuestionnaire;
  res.render('lobby.ejs', params);
});

router.get("/questionnaire/:idQuestionnaire/:idQuestion",function(req,res){
  var params = {};
  params.idQuestionnaire = req.params.idQuestionnaire;
  params.idQuestion = req.params.idQuestion;
  res.render('questionnaire.ejs', params);
});

//Stats de la question
router.get("/questionnaire/:idQuestionnaire/:idQuestion/stats",function(req,res){
  var params = {};
  params.idQuestionnaire = req.params.idQuestionnaire;
  params.idQuestion = req.params.idQuestion;
  res.render('stats.ejs', params);
});

//Stats global
router.get("/questionnaire/:idQuestionnaire/stats",function(req,res){
  var params = {};
  params.idQuestionnaire = req.params.idQuestionnaire;
  res.render('stats.ejs', params);
});

/**
*
* BUILD
*
**/
app.use("/",router);
app.use("/api",router);
app.use("*",function(req,res){
  res.render('404.ejs');
  // res.sendFile(__dirname + "/public/404.ejs");
});

app.listen(8080);
