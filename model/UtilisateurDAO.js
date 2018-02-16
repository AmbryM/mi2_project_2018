var user = require('./Utilisateur.js');

module.exports = class UtilisateurDAO {

	static getByPseudoPassword(db, pseudo, password){
		var requete = 'SELECT *'+
                ' FROM `utilisateur`' + 
                ' WHERE `pseudo`=\'' + pseudo + '\' AND `mdp`=\'' + password + '\'';

        var utilisateur;
		// Envoie de la requête
		db.query(requete, function(err, rows, fields){
		   if(err){
			    console.log('Impossible de lire les comptes analytiques');
		    }else{
		    	if(rows.length == 0){
		        	console.log('vide');
		    	}else{
		        	utilisateur = new user(rows[0].id, rows[0].pseudo, rows[0].mdp, rows[0].role, rows[0].groupe);
		        	return utilisateur;
		    	}
		    }
		});
	}
}