function Question (id, questionnaire, libelle, type){
	this.id = id;
	this.questionnaire = questionnaire;	// Objet questionnaire
	this.libelle = libelle;
	this.type = type || "";
}