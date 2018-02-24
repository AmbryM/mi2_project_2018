module.exports = class Resultat {

	constructor(etudiant, question, reponse, questionnaire){
		this.etudiant = etudiant; //id
		this.question = question; //id
		this.reponse = reponse; //id
		this.questionnaire = questionnaire; //id
	}

	/**
	 * Récupère une resultat avec son id
	 *
	 * @param db
	 * @param id
	 * @returns {Resultat}
	 */
	static getResultatById(db,id) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `resultat` WHERE `id`=\'' + id + '\'';
				db.query(sql,(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							var resultat = new Resultat(rows[0].id, rows[0].etudiant, rows[0].question, rows[0].reponse, rows[0].questionnaire);
							resolve(resultat);
						}
				});
		});

	}

	/**
	 * Récupère le nombre de réponses pour chaque choix d'une question d'un questionnare (pour graphique d'une question)
	 *
	 * @param db
	 * @param question
	 * @param questionnaire
	 * @returns {Resultat}
	 */
	static getResultatByQuestionQuestionnaire(db,question,questionnaire) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT count(`etudiant`) as "NbReponse",`reponse` as "NumQuestion" FROM `resultat` WHERE `question` = \'' + question + '\' AND `questionnaire` = \'' + quetionnaire + '\' GROUP BY `reponse`';
				// NbReponse | NumQuestion
				// 				1 |					 2      -  Il y a 1 personne qui ont repondu le choix 2 à la question
				// 				2 |					 4      -  Il y a 2 personnes qui ont repondu le choix 4 à la question
				db.query(sql,(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							var resultats = [];
							for(var i = 0; i<rows.length; i++){
								resultats.push(new Resultat(rows[i].etudiant, rows[i].question, rows[i].reponse, rows[i].question));
							}
							resolve(resultats);
						}
				});
		});

	}


	/**
	 * Créé une resultat
	 *
	 * @param db
	 * @param etudiant
	 * @param question
	 * @param reponse
	 * @param questionnaire
	 * @returns {boolean}
	 */
	static insertResultat(db,etudiant, question, reponse, questionnaire) {

		return new Promise((resolve, reject) => {
				db.query("INSERT INTO resultat (etudiant, question, reponse, questionnaire) VALUES (?,?,?,?)", [etudiant, question, reponse, questionnaire],(err,rows) => {
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
