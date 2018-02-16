module.exports = class Utilisateur {
	constructor(id, pseudo, mdp, role, groupe){
		this.id = id;
		this.pseudo = pseudo;
		this.mdp = mdp;
		this.role = role;
		this.groupe = groupe;
	}
}