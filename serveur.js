/**
*
* VARIABLES
*
**/
var mysql = require('mysql');
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var EtudiantModule = require('./Model/Etudiant.js');

var bodyParser = require('body-parser')

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mysql = require('mysql');

// var UtilisateurModule = require('./model/Utilisateur.js');
var userDAO = require('./model/Utilisateur.js');


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
app.use('/model', express.static(path.join(__dirname + '/model')));
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

router.post("/accueil",function(req,res){
  //Récupération des champs POST
  var params = {};

  params.pseudo = req.body.pseudo;
  params.password = req.body.password;
  //Création d'un utilisateur
  var user = userDAO.getByPseudoPassword(connection, params.pseudo, params.password);
  user.then(function(result) {
    var params = {};
    params.utilisateur = result;
    //Si c'est un prof on redirige vers son interface
    if (result.role) {
      res.render('professeur.ejs', params);
    }
    //Sinon c'est un eleve, et on redirige vers son interface
    else {
      res.render('eleve.ejs', params);
    }
  });

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
* DATABASE
*
**/

// var connection = mysql.createConnection({
//   host : 'localhost',
//   user : 'root',
//   password : '',
//   database : 'projet_web_dynamique'
// });

// connection.connect( function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });
//
// var etudiant = new EtudiantModule("Ambry","Maxime");
// etudiant.createInDB(connection);

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
