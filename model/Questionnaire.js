function Questionnaire (id, professeur, groupe, libelle){
	this.id = id;
	this.professeur = professeur; 	// Représente un utilisateur ayant le rôle "Professeur"
	this.groupe = groupe; 			// Objet groupe
	this.libelle = libelle;
	this.questions = [];			// Array d'objet Question; 
}

