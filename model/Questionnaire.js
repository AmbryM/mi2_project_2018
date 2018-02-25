module.exports = class Questionnaire {

	constructor(id, professeur, libelle, groupe) {
		this.id = id;
		this.professeur = professeur; 	// Représente un utilisateur ayant le rôle "Professeur"
		this.libelle = libelle;
		this.groupe = groupe; 			// Id groupe
  }


	/**
	 * Récupère un questionnaire avec son id
	 *
	 * @param db
	 * @param id
	 * @returns {Questionnaire}
	 */
	static getQuestionnaireById(db,id) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `questionnaire` WHERE `id`=\'' + id + '\'';
				db.query(sql,(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							var questionnaire = new Questionnaire(rows[0].id, rows[0].professeur, rows[0].libelle, rows[0].groupe);
							resolve(questionnaire);
						}
				});
		});

	}

	/**
	 * Récupère tous les questionnaire d'un groupe
	 *
	 * @param db
	 * @param groupe
	 * @returns {Questionnaire}
	 */
	static getQuestionnaireByGroupe(db,groupe) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `questionnaire` WHERE `groupe`=\'' + groupe + '\'';
				db.query(sql,(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							var questionnaires = [];
							for (var i = 0; i < rows.length; i++) {
								questionnaires.push(new Questionnaire(rows[i].id, rows[i].professeur, rows[i].libelle, rows[i].groupe));
							}
							resolve(questionnaires); // Renvoie la liste des questionnaires
						}
				});
		});

	}

	/**
	 * Récupère tous les questionnaires
	 *
	 * @param db
	 * @returns {Questionnaire}
	 */
	static getAllQuestionnaire(db) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `questionnaire`';
				db.query(sql,(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							var questionnaires = [];
							for (var i = 0; i < rows.length; i++) {
								questionnaires.push(new Questionnaire(rows[i].id, rows[i].professeur, rows[i].libelle, rows[i].groupe));
							}
							resolve(questionnaires); // Renvoie la liste des questionnaires
						}
				});
		});

	}

	/**
	 * Récupère le nombre de question d'un question avec son id
	 *
	 * @param db
	 * @param id
	 * @returns {Questionnaire}
	 */
	static getNbQuestionByQuestionnaire(db, id) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT COUNT(*) ' +
						  'FROM `questionnaire` QS '+
						  'INNER JOIN `question` Q '+
						  'ON Q.questionnaire = QS.id ' +
						  'WHERE QS.id=\'' + id + '\'';
				db.query(sql,(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							resolve(rows[0]['COUNT(*)']); // Renvoie le nombre de question
						}
				});
		});

	}

	/**
	 * Créé un questionnaire
	 *
	 * @param db
	 * @param professeur
	 * @param libelle
	 * @param groupe
	 * @returns {boolean}
	 */
	static insertQuestionnaire(db,professeur,libelle,groupe) {

		return new Promise((resolve, reject) => {
				db.query("INSERT INTO questionnaire (professeur,libelle,groupe) VALUES (?,?,?)", [professeur,libelle,groupe],(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							resolve(rows.insertId); //Tout c'est bien passé, on retourne l'id de l'élément inséré
						}
				});
		});

	}

	/**
	 * Supprimer un questionnaire
	 *
	 * @param db
	 * @param id
	 * @returns {boolean}
	 */
	static deleteQuestionnaire(db,id) {
		return new Promise((resolve, reject) => {
				db.query('DELETE FROM `questionnaire` WHERE `id`=\'' + id + '\'',(err,rows) => {
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
