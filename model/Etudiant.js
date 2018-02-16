const Client = require('./Client');

/**
 * Un Etudiant
 */
module.exports = class Etudiant extends Client {

    /**
     *
     * @param idEtudiant
     * @param nom
     * @param prenom
     */
    constructor(nom, prenom) {
        super(null);

        this._idEtudiant = -1;
        this._nom = nom;
        this._prenom = prenom;
    }

    // ------------------------------------------------------------------------------
    // Fonctions de mapping avec la BDD
    // ------------------------------------------------------------------------------

    /**
     * Crée un etudiant en BD et met à jour son id
     *
     * @returns {boolean} true si succes
     */
    createInDB(db) {
        db.query("INSERT INTO utilisateur (pseudo,mdp,role,groupe) VALUES (?,?,?,?)", [this._nom,this._prenom,0,0], function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    }

    /**
     * Récupère un étudiant via son id
     *
     * @param id
     * @returns {Etudiant}
     */
    static getById(id) {
        // Todo
        return null;
    }

    /**
     * Met à jour l'étudiant en BD
     *
     * @returns {boolean} true si succes
     */
    updateInDB() {
        // Todo
        return false;
    }

    /**
     * Supprime un étudiant de la BD
     *
     * @param id
     * @returns {boolean} true si succes
     */
    static remove(id) {
        // Todo
        return false;
    }

    // ------------------------------------------------------------------------------
    // Getter / Setter
    // ------------------------------------------------------------------------------

    get idEtudiant() {
        return this._idEtudiant;
    }

    set idEtudiant(value) {
        this._idEtudiant = value;
    }

    get nom() {
        return this._nom;
    }

    set nom(value) {
        this._nom = value;
    }

    get prenom() {
        return this._prenom;
    }

    set prenom(value) {
        this._prenom = value;
    }
}
