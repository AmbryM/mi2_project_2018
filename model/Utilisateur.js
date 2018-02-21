module.exports = class Utilisateur {

	constructor(id, pseudo, mdp, role, groupe) {
		this.id = id;
		this.pseudo = pseudo;
		this.mdp = mdp;
		this.role = role;
		this.groupe = groupe;
  }

	static getByPseudoPassword(db, pseudo, password){

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `utilisateur` WHERE `pseudo`=\'' + pseudo + '\' AND `mdp`=\'' + password + '\'';
        db.query(sql,(err,rows) => {
            if (err) {
							return reject(err);
						}
						else {
							var user = new Utilisateur(rows[0].id, rows[0].pseudo, rows[0].mdp, rows[0].role, rows[0].groupe);
							resolve(user);
						}
        });
    });



    // var finalUser = JSON.stringify('utilisateur');
		// Envoie de la requête
		// return db.query(requete, function(err, result, fields){
		//
		//    if(err) {
		// 	    console.log('Impossible de lire les comptes analytiques');
		//    }
		// 	 else {
		//
		// 			// var utilisateur;
		//
		// 			if(result.length == 0) {
		//         	console.log('vide');
		//     	}
		//
		// 			else {
		// 					// utilisateur = 'test4';
		        	// new user(result[0].id, result[0].pseudo, result[0].mdp, result[0].role, result[0].groupe);
		// 					// finalUser = JSON.stringify(utilisateur);
		// 					// console.log(JSON.stringify(utilisateur));
		// 					// console.log('TEST'+utilisateur+' ET '+utilisateur.pseudo);
		//     	}
		//
		// 			// return  utilisateur;
		//     }
		//
		// 		// return 'aaa';
		// });


		// return final;


	}


	static teste(pseudo, password){

		return pseudo;

	}
}
