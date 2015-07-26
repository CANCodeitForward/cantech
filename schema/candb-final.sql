# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.23)
# Database: candb
# Generation Time: 2015-07-26 04:03:12 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table class
# ------------------------------------------------------------

DROP TABLE IF EXISTS `class`;

CREATE TABLE `class` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int(11) unsigned DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table participant
# ------------------------------------------------------------

DROP TABLE IF EXISTS `participant`;

CREATE TABLE `participant` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email_address` varchar(255) DEFAULT NULL,
  `gender` varchar(8) DEFAULT NULL,
  `first_name` varchar(32) DEFAULT NULL,
  `last_name` varchar(32) DEFAULT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `emergency_contact1_id` int(11) DEFAULT NULL,
  `emergency_contact2_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table participant_attendance
# ------------------------------------------------------------

DROP TABLE IF EXISTS `participant_attendance`;

CREATE TABLE `participant_attendance` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `class_id` int(11) unsigned DEFAULT NULL,
  `participant_id` int(11) unsigned DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `type` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`),
  KEY `participant_id` (`participant_id`),
  CONSTRAINT `participant_attendance_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class` (`id`),
  CONSTRAINT `participant_attendance_ibfk_2` FOREIGN KEY (`participant_id`) REFERENCES `participant` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table participant_registration
# ------------------------------------------------------------

DROP TABLE IF EXISTS `participant_registration`;

CREATE TABLE `participant_registration` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int(11) unsigned DEFAULT NULL,
  `participant_id` int(11) unsigned DEFAULT NULL,
  `status` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `participant_id` (`participant_id`),
  CONSTRAINT `participant_registration_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  CONSTRAINT `participant_registration_ibfk_2` FOREIGN KEY (`participant_id`) REFERENCES `participant` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table session
# ------------------------------------------------------------

DROP TABLE IF EXISTS `session`;

CREATE TABLE `session` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `worker_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `worker_id` (`worker_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`worker_id`) REFERENCES `worker` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table worker
# ------------------------------------------------------------

DROP TABLE IF EXISTS `worker`;

CREATE TABLE `worker` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email_address` varchar(255) DEFAULT NULL,
  `first_name` varchar(32) DEFAULT NULL,
  `last_name` varchar(32) DEFAULT NULL,
  `phone_number` varchar(32) DEFAULT NULL,
  `type` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table worker_attendance
# ------------------------------------------------------------

DROP TABLE IF EXISTS `worker_attendance`;

CREATE TABLE `worker_attendance` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `class_id` int(11) unsigned DEFAULT NULL,
  `worker_id` int(11) unsigned DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `type` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`),
  KEY `worker_id` (`worker_id`),
  CONSTRAINT `worker_attendance_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class` (`id`),
  CONSTRAINT `worker_attendance_ibfk_2` FOREIGN KEY (`worker_id`) REFERENCES `worker` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table worker_registration
# ------------------------------------------------------------

DROP TABLE IF EXISTS `worker_registration`;

CREATE TABLE `worker_registration` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int(11) unsigned DEFAULT NULL,
  `worker_id` int(11) unsigned DEFAULT NULL,
  `status` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `worker_id` (`worker_id`),
  CONSTRAINT `worker_registration_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  CONSTRAINT `worker_registration_ibfk_2` FOREIGN KEY (`worker_id`) REFERENCES `worker` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
