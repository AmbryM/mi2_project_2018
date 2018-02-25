module.exports = class Reponse {

	constructor(id, libelle, etat, question){
		this.id = id;
		this.libelle = libelle;
		this.etat = etat;		  // Boolean designant si la réponse est la bonne ou non
		this.question = question; // Objet Reponse
  }

	/**
	 * Récupère une reponse avec son id
	 *
	 * @param db
	 * @param id
	 * @returns {Reponse}
	 */
	static getReponseById(db,id) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `reponse` WHERE `id`=\'' + id + '\'';
				db.query(sql,(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							var reponse = new Reponse(rows[0].id, rows[0].libelle, rows[0].etat, rows[0].question);
							resolve(reponse);
						}
				});
		});

	}

	/**
	 * Récupère la réponse juste d'une question
	 *
	 * @param db
	 * @param question
	 * @returns {Reponse}
	 */
	static getReponseJusteFromQuestion(db,question) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `reponse` WHERE `question`=\'' + question + '\' AND `type` = 1';
				db.query(sql,(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							var reponses = [];
							for(var i = 0; i < rows.length; i++){
								reponses.push(new Reponse(rows[i].id, rows[i].libelle, rows[i].etat, rows[i].question));
							}
							resolve(reponses);
						}
				});
		});

	}

	/**
	 * Récupère tous les reponse d'une question
	 *
	 * @param db
	 * @param question
	 * @returns {Reponse}
	 */
	static getReponsesFromQuestion(db,question) {

		return new Promise((resolve, reject) => {
				var sql = 'SELECT * FROM `reponse` WHERE `question`=\'' + question + '\'';
				db.query(sql,(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
                            var reponses = [];
							for(var i = 0; i < rows.length; i++){
								reponses.push(new Reponse(rows[i].id, rows[i].libelle, rows[i].etat, rows[i].question));
							}
							resolve(reponses);
						}
				});
		});

	}


	/**
	 * Créé une reponse
	 *
	 * @param db
	 * @param libelle
	 * @param etat
	 * @param question
	 * @returns {boolean}
	 */
	static insertReponse(db,libelle,etat,question) {

		return new Promise((resolve, reject) => {
				db.query("INSERT INTO reponse (libelle,etat,question) VALUES (?,?,?)", [libelle,etat,question],(err,rows) => {
						if (err) {
							return reject(err);
						}
						else {
							resolve(1); //Tout c'est bien passé
						}
				});
		});

	}

    static deleteSelonIdQuestionnaire(db,id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM Reponse WHERE question in'  +
						'(SELECT id FROM Question WHERE questionnaire =' + id + ')',(err,rows) => {
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