module.exports = class Utilisateur {

	constructor(id, pseudo, mdp, role, groupe) {
		this.id = id;
		this.pseudo = pseudo;
		this.mdp = mdp;
		this.role = role;
		this.groupe = groupe;
  }

	/**
	 * Récupère un étudiant avec ses identifiants de connexion
	 *
	 * @param db
	 * @param pseudo
	 * @param password
	 * @returns {Utilisateur}
	 */
	static getUtilisateurByPseudoPassword(db, pseudo, password){

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

	}

	/**
	 * Récupère un étudiant avec son id
	 *
	 * @param db
	 * @param id
	 * @returns {Utilisateur}
	 */
	static getUtilisateurById(db,id) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `utilisateur` WHERE `id`=\'' + id + '\'';
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

	}

	/**
	 * Récupère tous les groupes
	 *
	 * @param db
	 * @returns {Utilisateur}
	 */
	static getAllUtilisateur(db) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `Utilisateur`';
				db.query(sql,(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							var utilisateurs = [];
							for(var i = 0; i <rows.length; i++){
								utilisateurs.push(new Utilisateur(rows[i].id, rows[i].pseudo, rows[i].mdp, rows[i].role, rows[i].groupe));
							}
							resolve(utilisateurs);
						}
				});
		});

	}

	/**
	 * Créé un étudiant
	 *
	 * @param db
	 * @param pseudo
	 * @param mdp
	 * @param role
	 * @param groupe
	 * @returns {boolean}
	 */
	static insertUtilisateur(db,pseudo,mdp,role,groupe) {

		return new Promise((resolve, reject) => {
				db.query("INSERT INTO utilisateur (pseudo,mdp,role,groupe) VALUES (?,?,?,?)", [pseudo,mdp,role,groupe],(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							resolve(1); //Tout c'est bien passé
						}
				});
		});

	}



}
