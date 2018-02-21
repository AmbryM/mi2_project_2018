module.exports = class Groupe {

	constructor(id, libelle) {
		this.id = id;
		this.libelle = libelle;
  }

	/**
	 * Récupère un groupe avec son id
	 *
	 * @param db
	 * @param id
	 * @returns {Groupe}
	 */
	static getGroupeById(db,id) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `groupe` WHERE `id`=\'' + id + '\'';
				db.query(sql,(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							var groupe = new Groupe(rows[0].id, rows[0].libelle);
							resolve(groupe);
						}
				});
		});

	}

	/**
	 * Récupère tous les groupes
	 *
	 * @param db
	 * @returns {Groupe}
	 */
	static getAllGroupe(db) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `groupe`';
				db.query(sql,(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							//TODO. Traiter ROWS pour retourner une liste
							resolve(rows);
						}
				});
		});

	}

	/**
	 * Créé un groupe
	 *
	 * @param db
	 * @param libelle
	 * @returns {boolean}
	 */
	static insertGroupe(db,libelle) {

		return new Promise((resolve, reject) => {
				db.query("INSERT INTO groupe (libelle) VALUES (?)", [libelle],(err,rows) => {
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
