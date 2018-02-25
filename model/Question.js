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
	static getQuestionByQuestion(db,questionnaire) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `question` WHERE `questionnaire`=\'' + questionnaire + '\'';
				db.query(sql,(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							var questions = [];
							for(var i = 0; i < rows.length; i++) {
								rows[i].libelle = rows[i].libelle.replace(/'/g, "\\\'");
								questions.push(new Question(rows[i].id, rows[i].libelle, rows[i].type, rows[i].questionnaire));
							}
							resolve(questions);
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
	static insertQuestion(db,libelle,type,nbreponse,questionnaire) {

		return new Promise((resolve, reject) => {
				db.query("INSERT INTO question (libelle,type,nbreponse,questionnaire) VALUES (?,?,?,?)", [libelle,type,nbreponse,questionnaire],(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							var array = [rows.insertId,nbreponse];
							resolve(array); //Tout c'est bien passé, on retourne l'id de l'élément inséré
						}
				});
		});

	}




}
