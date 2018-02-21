module.exports = class Question {

	constructor(id, libelle, type, questionnaire) {
		this.id = id;
		this.libelle = libelle;
		this.type = type || "";
		this.questionnaire = questionnaire;	// Id questionnaire
  }


	/**
	 * Récupère une question avec son id
	 *
	 * @param db
	 * @param id
	 * @returns {Question}
	 */
	static getQuestionById(db,id) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `question` WHERE `id`=\'' + id + '\'';
				db.query(sql,(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							var question = new Question(rows[0].id, rows[0].libelle, rows[0].type, rows[0].questionnaire);
							resolve(question);
						}
				});
		});

	}

	/**
	 * Récupère tous les question d'un questionnaire
	 *
	 * @param db
	 * @param questionnaire
	 * @returns {Question}
	 */
	static getQuestionByQuestionnaire(db,questionnaire) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `question` WHERE `questionnaire`=\'' + questionnaire + '\'';
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
	 * Créé une question
	 *
	 * @param db
	 * @param libelle
	 * @param type
	 * @param questionnaire
	 * @returns {boolean}
	 */
	static insertQuestionnaire(db,libelle,type,questionnaire) {

		return new Promise((resolve, reject) => {
				db.query("INSERT INTO question (libelle,type,questionnaire) VALUES (?,?,?)", [libelle,type,questionnaire],(err,rows) => {
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
