-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  jeu. 15 fév. 2018 à 12:41
-- Version du serveur :  5.7.19
-- Version de PHP :  7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `projet_web_dynamique`
--
-- --------------------------------------------------------

--
-- Structure de la table `groupe`
--

DROP TABLE IF EXISTS `groupe`;
CREATE TABLE IF NOT EXISTS `groupe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `groupe`
--

INSERT INTO `groupe` (`id`, `libelle`) VALUES
  (1, 'AW'),
  (2, 'ASSR');

-- --------------------------------------------------------

--
-- Structure de la table `question`
--

DROP TABLE IF EXISTS `question`;
CREATE TABLE IF NOT EXISTS `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(255) NOT NULL,
  `type` int(11) NOT NULL,
  `nbreponse` int(11) NOT NULL,
  `questionnaire` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_questionnaire_id` (`questionnaire`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `question`
--

INSERT INTO `question` (`id`, `libelle`, `type`, `questionnaire`) VALUES
  (1, 'Quelle est la couleur du cheval blanc d\'Henry IV ?', 1, 1),
  (2, 'De quelle couleur est le ciel', 2, 2);

-- --------------------------------------------------------

--
-- Structure de la table `questionnaire`
--

DROP TABLE IF EXISTS `questionnaire`;
CREATE TABLE IF NOT EXISTS `questionnaire` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `professeur` int(11) NOT NULL,
  `libelle` varchar(25) NOT NULL,
  `groupe` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_groupe_id` (`groupe`),
  KEY `fk_professeur_id` (`professeur`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `questionnaire`
--

INSERT INTO `questionnaire` (`id`, `professeur`, `libelle`, `groupe`) VALUES
  (1, 1, 'Questionnaire Symfony', 1),
  (2, 2, 'Questionnaire java', 2);

-- --------------------------------------------------------

--
-- Structure de la table `reponse`
--

DROP TABLE IF EXISTS `reponse`;
CREATE TABLE IF NOT EXISTS `reponse` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(255) NOT NULL,
  `etat` tinyint(1) DEFAULT NULL,
  `question` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_question_id` (`question`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `reponse`
--

INSERT INTO `reponse` (`id`, `libelle`, `etat`, `question`) VALUES
  (1, 'Noir', 1, 1),
  (2, 'Blanc', 0, 1);

-- --------------------------------------------------------

--
-- Structure de la table `resultat`
--

DROP TABLE IF EXISTS `resultat`;
CREATE TABLE IF NOT EXISTS `resultat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `etudiant` int(11) NOT NULL,
  `question` int(11) NOT NULL,
  `reponse` int(11) NOT NULL,
  `questionnaire` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_etudiant_id` (`etudiant`),
  KEY `fk_question_id` (`question`),
  KEY `fk_reponse_id` (`reponse`),
  KEY `fk_questionnaire_id` (`questionnaire`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `resultat`
--

INSERT INTO `resultat` (`id`, `etudiant`, `question`, `reponse`, `questionnaire`) VALUES
  (1, 3, 1, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(12) NOT NULL,
  `mdp` varchar(100) NOT NULL,
  `role` int(11) NOT NULL,
  `groupe` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_groupe_id` (`groupe`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `pseudo`, `mdp`, `role`, `groupe`) VALUES
  (1, 'martinp', 'martinp', 1, NULL),
  (2, 'blanchonh', 'blanchonh', 1, NULL),
  (3, 'andrev', 'andrev', 0, 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
