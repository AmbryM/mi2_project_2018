/**
*
* VARIABLES
*
**/
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();
var router = express.Router();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var bodyParser = require('body-parser');

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.utilisateur) {
        res.clearCookie('user_sid');
    }
    next();
});


// Vérifie s'il y a un utilisateur en session
var sessionChecker = (req, res, next) => {
    if (req.session.utilisateur && req.cookies.user_sid) {
        res.redirect('/accueil');
    } else {
        next();
    }
};



var mysql = require('mysql');

// var UtilisateurModule = require('./model/Utilisateur.js');
var userDAO = require('./model/Utilisateur.js');
var questionnaireDAO = require('./model/Questionnaire.js');
var questionDAO = require('./model/Question.js');
var reponseDAO = require('./model/Reponse.js');

var user;


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
app.get('/', sessionChecker, function(req, res) {
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
  user.then(function(result) {
    var params = {};
    params.utilisateur = result;
      groupeDAO = require('./model/Groupe.js');
      var groupes = groupeDAO.getAllGroupe(connection);
      groupes.then(function(result){
          params.groupes = result;
          console.log(groupes);
          res.render('creation.ejs', params);
      });
  });

});

router.post("/questionnaire/add",function(req,res){
  //Récupération des champs POST
  var params = {};
  //Questionnaire
  params.libelleQuestionnaire = req.body.libelleQuestionnaire;
  params.nbQuestion = req.body.nbQuestion;
  params.professor = req.body.professor;
  params.groupe = req.body.groupe;
  params.num = 0;

  //On créé un questionnaire
  var questionnaire = questionnaireDAO.insertQuestionnaire(connection, params.professor, params.libelleQuestionnaire, params.groupe);
  questionnaire.then(function(result) {
    //Si l'insertion s'est bien passée
    if (result) {
      var idQuestionnaire = result;
      //Pour ce questionnaire, on créé le nombre de question renseignées
      for (var i = 0; i < params.nbQuestion; i++) {
        //On créé la question avec des variables dynamiques..
        var question = questionDAO.insertQuestion(connection, req.body['libelleQuestion_'+(i+1)], req.body['typeQuestion_'+(i+1)], req.body['nbReponses_'+(i+1)], idQuestionnaire);
        question.then(function(result) {
          //Si la question est bien créée on créé les reponses
          if (result) {
            var idQuestion = result[0];
            var nbReponses = result[1];
            //Numéro de la question en cours
            params.num = params.num + 1;
            //Pour cette question, on créé le nombre de réponses renseignées avec des variables dynamiques
            for (var j = 0; j < nbReponses; j++) {
              //TODO. Paramètre type (reponse juste ou fausse) a changer en fonction des check box !
              var reponse = reponseDAO.insertReponse(connection, req.body['libelleQuestion_'+params.num+'Reponse_'+(j+1)], 0, idQuestion);
            }
          }
        });
      }
    }
  });
  //On redirige vers la liste en indiquant a nouveau l'utilisateur
  user = userDAO.getUtilisateurById(connection, params.professor);
  user.then(function(result) {
    var params = {};
    params.utilisateur = result;

    questionnaireDAO = require('./model/Questionnaire.js');
    var questionnaires = questionnaireDAO.getAllQuestionnaire(connection);
    questionnaires.then(function(result){
      params.questionnaires = result;
      res.render('professeur.ejs', params);
    });

  });

});

router.get("/accueil", function(req, res){
  var params = {};
  if (req.session.utilisateur && req.cookies.user_sid) {
    params.utilisateur = req.session.utilisateur;
    if(params.utilisateur.role){
      // Récupération de tous les questionnaires
      questionnaireDAO = require('./model/Questionnaire.js');
      var questionnaires = questionnaireDAO.getAllQuestionnaire(connection);
      questionnaires.then(function(result){
        params.questionnaires = result;
        res.render('professeur.ejs', params);
      });
    }else{
      // Récupération de l'objet Groupe
      groupeDAO = require('./model/Groupe.js');
      var groupe = groupeDAO.getGroupeById(connection, params.utilisateur.groupe);
      groupe.then(function(result){
        params.oGroupe = result;
      });

      // Récupération des questionnaires associées à l'élève
      questionnaireDAO = require('./model/Questionnaire.js');
      var questionnaires = questionnaireDAO.getQuestionnaireByGroupe(connection, params.utilisateur.groupe);
      questionnaires.then(function(result){
        params.questionnaires = result;
        res.render('eleve.ejs', params);
      });
    }
  }
})

router.post("/accueil",function(req,res){
  //Récupération des champs POST
  var params = {};
  params.pseudo = req.body.pseudo;
  params.password = req.body.password;
  //Création d'un utilisateur
  user = userDAO.getUtilisateurByPseudoPassword(connection, params.pseudo, params.password);
  user.then(function(result) {
    var params = {};
    params.utilisateur = result;
    req.session.utilisateur = result;
    //Si c'est un prof on redirige vers son interface
    if (result.role) {
      // Récupération de tous les questionnaires
      questionnaireDAO = require('./model/Questionnaire.js');
      var questionnaires = questionnaireDAO.getAllQuestionnaire(connection);
      questionnaires.then(function(result){
        params.questionnaires = result;
        res.render('professeur.ejs', params);
      });
    }
    //Sinon c'est un eleve, et on redirige vers son interface
    else {
      // Récupération de l'objet Groupe
      groupeDAO = require('./model/Groupe.js');
      var groupe = groupeDAO.getGroupeById(connection, result.groupe);
      groupe.then(function(result){
        params.oGroupe = result;
      });

      // Récupération des questionnaires associées à l'élève
      questionnaireDAO = require('./model/Questionnaire.js');
      var questionnaires = questionnaireDAO.getQuestionnaireByGroupe(connection, result.groupe);
      questionnaires.then(function(result){
        params.questionnaires = result;
        res.render('eleve.ejs', params);
      });
    }
  });

});

router.get("/questionnaire/:idQuestionnaire/lobby",function(req,res){
  var params = {};
  params.idQuestionnaire = req.params.idQuestionnaire;
  // Récupération de la session
  params.utilisateur = JSON.stringify(req.session.utilisateur);
  params.questions = 0;
  if(req.session.utilisateur.role){
    questionDAO = require('./model/Question.js');
    var questions = questionDAO.getQuestionByQuestion(connection, params.idQuestionnaire);
    questions.then(function(result){
      params.questions = JSON.stringify(result);
      console.log(params.questions);
      res.render('lobby.ejs', params);
    });
  }else{
    res.render('lobby.ejs', params);
  }
});

//Suppression questionnaire
router.get("/questionnaire/:idQuestionnaire/supprimer",function(req,res){
    var params = {};
    params.idQuestionnaire = req.params.idQuestionnaire;
    params.utilisateur = JSON.stringify(req.session.utilisateur);
    questionnaireDAO = require('./model/Questionnaire');
    var deleteQuestionnaire = questionnaireDAO.deleteQuestionnaire(connection, params.idQuestionnaire);
    deleteQuestionnaire.then(function(result){
      reponseDAO = require('./model/Reponse');
      var deleteReponse = reponseDAO.deleteSelonIdQuestionnaire(connection, params.idQuestionnaire);
      deleteReponse.then(function(result) {
        questionDAO = require('./model/Question');
        var deleteQuestion = questionDAO.deleteSelonIdQuestionnaire(connection, params.idQuestionnaire);
        deleteQuestion.then(function(result) {
            resultatDAO = require('./model/Resultat');
            var deleteResultat = resultatDAO.deleteSelonIdQuestionnaire(connection, params.idQuestionnaire);
            deleteResultat.then(function (result) {
                var questionnaires = questionnaireDAO.getAllQuestionnaire(connection);
                questionnaires.then(function (resultat) {
                    params.questionnaires = resultat;
                    res.render('professeur.ejs', params);
                });
            });
        });
      });
    });
});

router.get("/questionnaire/:idQuestionnaire/:idQuestion",function(req,res){
  var params = {};
  params.idQuestionnaire = req.params.idQuestionnaire;
  params.idQuestion = req.params.idQuestion;
  // Récupération de la session
  params.utilisateur = JSON.stringify(req.session.utilisateur);
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


//Logout
router.get('/logout', function(req, res){
  if(req.session.utilisateur && req.cookies.user_sid){
    res.clearCookie('user_sid');
    res.redirect('/');
  }else{
    res.redirect('/');
  }
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

// Quand un client se connecte, on le note dans la console

var lobbies = {};

io.sockets.on('connection', function (socket) {

  // Rafraichit la liste des participants de tous les questionnaires
  setInterval(function(){
    Object.keys(lobbies).forEach(function(key){
      socket.broadcast.emit('userList'+key, lobbies[key]);
    });
    // socket.emit('userList', users);
  }, 2500);

  socket.on('newConnection', function(info){
    // Créer le lobby pour le questionnaire
    if(lobbies[info.questionnaire]){
      // Ajout de l'utilisateur dans le lobby du questionnaire
      lobbies[info.questionnaire][socket.id] = info.user;
    }else{
      // Création du lobby pour le questionnaire
      lobbies[info.questionnaire] = {};
      // Ajout de l'utilisateur dans le lobby
      lobbies[info.questionnaire][socket.id] = info.user;
    }
    // Rafraichit la liste des participants de tous les questionnaires
    Object.keys(lobbies).forEach(function(key){
      socket.broadcast.emit('userList'+key, lobbies[key]);
    });
    if(info.user.role){
      console.log('Le professeur ' + info.user.pseudo + ' s\'est connecté au questionnaire #' + info.questionnaire);
    }else{
      console.log('L\'élève ' + info.user.pseudo + ' s\'est connecté au questionnaire #' + info.questionnaire);
    }
  });

  socket.on('disconnect', function(){
    Object.keys(lobbies).forEach(function(key){
      delete lobbies[key][socket.id];
      socket.broadcast.emit('userList'+key, lobbies[key]);
    });
  });

  socket.on('start', function(data){
    // Récupération des utilisateurs connectés au lobby du questionnaire
    users = lobbies[data.idQuestionnaire];
    // Envoyer à chaque utilisateur connectés que le questionnaire commence
    // sauf au professeur
    Object.keys(users).forEach(function(key){
      if(!users[key].role){
        io.to(key).emit('start', data.questions);
      }
    });
  });

});

server.listen(8080);
