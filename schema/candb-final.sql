-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.6.26-log - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             9.2.0.4947
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping database structure for candb
CREATE DATABASE IF NOT EXISTS `candb` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `candb`;


-- Dumping structure for table candb.class
CREATE TABLE IF NOT EXISTS `class` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int(11) unsigned DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;

-- Dumping data for table candb.class: ~24 rows (approximately)
DELETE FROM `class`;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
INSERT INTO `class` (`id`, `session_id`, `date`) VALUES
	(1, 1, '2015-07-04 10:30:00'),
	(2, 1, '2015-07-11 10:30:00'),
	(3, 1, '2015-07-18 10:30:00'),
	(4, 1, '2015-07-25 10:30:00'),
	(5, 1, '2015-08-01 10:30:00'),
	(6, 1, '2015-08-08 10:30:00'),
	(7, 1, '2015-08-15 10:30:00'),
	(8, 1, '2015-08-22 10:30:00'),
	(9, 2, '2015-07-06 17:30:00'),
	(10, 2, '2015-07-13 17:30:00'),
	(11, 2, '2015-07-20 17:30:00'),
	(12, 2, '2015-07-27 16:30:00'),
	(13, 2, '2015-08-03 17:30:00'),
	(14, 2, '2015-08-10 17:30:00'),
	(15, 2, '2015-08-17 17:30:00'),
	(16, 2, '2015-08-24 17:30:00'),
	(17, 3, '2015-07-05 14:00:00'),
	(18, 3, '2015-07-12 14:00:00'),
	(19, 3, '2015-07-19 14:00:00'),
	(20, 3, '2015-07-26 14:00:00'),
	(21, 3, '2015-08-02 14:00:00'),
	(22, 3, '2015-08-09 14:00:00'),
	(23, 3, '2015-08-16 14:00:00'),
	(24, 3, '2015-08-24 14:00:00');
/*!40000 ALTER TABLE `class` ENABLE KEYS */;


-- Dumping structure for table candb.participant
CREATE TABLE IF NOT EXISTS `participant` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email_address` varchar(255) DEFAULT NULL,
  `gender` varchar(8) DEFAULT NULL,
  `first_name` varchar(32) DEFAULT NULL,
  `last_name` varchar(32) DEFAULT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `emergency_contact1_id` varchar(32) DEFAULT NULL,
  `emergency_contact2_id` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

-- Dumping data for table candb.participant: ~20 rows (approximately)
DELETE FROM `participant`;
/*!40000 ALTER TABLE `participant` DISABLE KEYS */;
INSERT INTO `participant` (`id`, `email_address`, `gender`, `first_name`, `last_name`, `phone`, `emergency_contact1_id`, `emergency_contact2_id`) VALUES
	(1, 'olivia@test.com', 'Female', 'Olivia', 'Lee', '7785115083', '7783254191', '7785929916'),
	(2, 'emma@test.com', 'Female', 'Emma', 'Wong', '7784161390', '7788158918', '7786163297'),
	(3, 'sophia@test.com', 'Female', 'Sophia', 'Chan', '7783537537', '7785392360', '7784772649'),
	(4, 'emily@test.com', 'Female', 'Emily', 'Smith', '7788015160', '7788476171', '7786367272'),
	(5, 'ava@test.com', 'Female', 'Ava', 'Kim', '7784598011', '7786826597', '7787428530'),
	(6, 'chloe@test.com', 'Female', 'Chloe', 'Chen', '7784852924', '7788438047', '7784732882'),
	(7, 'charlotte@test.com', 'Female', 'Charlotte', 'Gill', '7784997371', '7785706335', '7784313365'),
	(8, 'ella@test.com', 'Female', 'Ella', 'Li', '7785110313', '7785513717', '7785983210'),
	(9, 'avery@test.com', 'Female', 'Avery', 'Brown', '7787663805', '7784523538', '7785083042'),
	(10, 'hannah@test.com', 'Female', 'Hannah', 'Johnson', '7784491210', '7782581997', '7787115664'),
	(11, 'liam@test.com', 'Male', 'Liam', 'Wang', '7785668976', '7783222621', '7786850586'),
	(12, 'mason@test.com', 'Male', 'Mason', 'Wilson', '7785563783', '7786200972', '7782520337'),
	(13, 'liam@test.com', 'Male', 'Liam', 'Leung', '7785366833', '7784521914', '7788986922'),
	(14, 'lucas@test.com', 'Male', 'Lucas', 'Anderson', '7786680907', '7786571543', '7784825403'),
	(15, 'ben@test.com', 'Male', 'Benjamin', 'Lam', '7786717242', '7782437490', '7786495073'),
	(16, 'logan@test.com', 'Male', 'Logan', 'Jones', '7782586012', '7787456992', '7782639727'),
	(17, 'bill@test.com', 'Male', 'William', 'Taylor', '7782990305', '7784917699', '7787923441'),
	(18, 'alex@test.com', 'Male', 'Alexander', 'Singh', '7783070992', '7783975578', '7783853683'),
	(19, 'oliver@test.com', 'Male', 'Oliver', 'Liu', '7786623954', '7784691416', '7786186268'),
	(20, 'noah@test.com', 'Male', 'Noah', 'Williams', '7784236242', '7782195466', '7782726701');
/*!40000 ALTER TABLE `participant` ENABLE KEYS */;


-- Dumping structure for table candb.participant_attendance
CREATE TABLE IF NOT EXISTS `participant_attendance` (
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

-- Dumping data for table candb.participant_attendance: ~0 rows (approximately)
DELETE FROM `participant_attendance`;
/*!40000 ALTER TABLE `participant_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `participant_attendance` ENABLE KEYS */;


-- Dumping structure for table candb.participant_registration
CREATE TABLE IF NOT EXISTS `participant_registration` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int(11) unsigned DEFAULT NULL,
  `participant_id` int(11) unsigned DEFAULT NULL,
  `status` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `participant_id` (`participant_id`),
  CONSTRAINT `participant_registration_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  CONSTRAINT `participant_registration_ibfk_2` FOREIGN KEY (`participant_id`) REFERENCES `participant` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;

-- Dumping data for table candb.participant_registration: ~30 rows (approximately)
DELETE FROM `participant_registration`;
/*!40000 ALTER TABLE `participant_registration` DISABLE KEYS */;
INSERT INTO `participant_registration` (`id`, `session_id`, `participant_id`, `status`) VALUES
	(1, 1, 7, 'CONFIRMED'),
	(2, 1, 6, 'CONFIRMED'),
	(3, 1, 8, 'CONFIRMED'),
	(4, 1, 4, 'CONFIRMED'),
	(5, 1, 13, 'CONFIRMED'),
	(6, 1, 2, 'CONFIRMED'),
	(7, 1, 11, 'CONFIRMED'),
	(8, 1, 16, 'CONFIRMED'),
	(9, 1, 20, 'CONFIRMED'),
	(10, 1, 10, 'CONFIRMED'),
	(11, 2, 17, 'CONFIRMED'),
	(12, 2, 15, 'CONFIRMED'),
	(13, 2, 9, 'CONFIRMED'),
	(14, 2, 5, 'CONFIRMED'),
	(15, 2, 18, 'CONFIRMED'),
	(16, 2, 3, 'CONFIRMED'),
	(17, 2, 1, 'CONFIRMED'),
	(18, 2, 19, 'CONFIRMED'),
	(19, 2, 20, 'CONFIRMED'),
	(20, 2, 12, 'CONFIRMED'),
	(21, 3, 14, 'CONFIRMED'),
	(22, 3, 16, 'CONFIRMED'),
	(23, 3, 11, 'CONFIRMED'),
	(24, 3, 13, 'CONFIRMED'),
	(25, 3, 10, 'CONFIRMED'),
	(26, 3, 2, 'CONFIRMED'),
	(27, 3, 15, 'CONFIRMED'),
	(28, 3, 17, 'CONFIRMED'),
	(29, 3, 9, 'CONFIRMED'),
	(30, 3, 5, 'CONFIRMED');
/*!40000 ALTER TABLE `participant_registration` ENABLE KEYS */;


-- Dumping structure for table candb.program
CREATE TABLE IF NOT EXISTS `program` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '0',
  `coordinator` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_program_worker` (`coordinator`),
  CONSTRAINT `FK_program_worker` FOREIGN KEY (`coordinator`) REFERENCES `worker` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table candb.program: ~3 rows (approximately)
DELETE FROM `program`;
/*!40000 ALTER TABLE `program` DISABLE KEYS */;
INSERT INTO `program` (`id`, `name`, `coordinator`) VALUES
	(1, 'I CAN Play Soccer', 21),
	(2, 'I CAN Swim', 21),
	(3, 'I CAN Play Basketball', 21);
/*!40000 ALTER TABLE `program` ENABLE KEYS */;


-- Dumping structure for table candb.report
CREATE TABLE IF NOT EXISTS `report` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `class` int(11) unsigned DEFAULT NULL,
  `worker` int(11) unsigned DEFAULT NULL COMMENT 'Person who submitted this report.',
  `needs` varchar(5000) DEFAULT NULL,
  `facility_concerns` varchar(5000) DEFAULT NULL,
  `worker_concerns` varchar(5000) DEFAULT NULL,
  `participant_concerns` varchar(5000) DEFAULT NULL,
  `incidents` int(11) unsigned DEFAULT '0' COMMENT 'Number of incident reports (sent separately).',
  PRIMARY KEY (`id`),
  KEY `FK_report_class` (`class`),
  KEY `FK_report_worker` (`worker`),
  CONSTRAINT `FK_report_class` FOREIGN KEY (`class`) REFERENCES `class` (`id`),
  CONSTRAINT `FK_report_worker` FOREIGN KEY (`worker`) REFERENCES `worker` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table candb.report: ~0 rows (approximately)
DELETE FROM `report`;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;


-- Dumping structure for table candb.session
CREATE TABLE IF NOT EXISTS `session` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `program` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_session_program` (`program`),
  CONSTRAINT `FK_session_program` FOREIGN KEY (`program`) REFERENCES `program` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table candb.session: ~3 rows (approximately)
DELETE FROM `session`;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` (`id`, `name`, `start_date`, `end_date`, `venue`, `program`) VALUES
	(1, 'I CAN Play Soccer', '2015-07-04 10:30:00', '2015-08-22 11:30:00', 'West End', 1),
	(2, 'I CAN Swim', '2015-07-06 17:30:00', '2015-08-24 18:00:00', 'Guildford', 2),
	(3, 'I CAN Play Basketball', '2015-07-05 14:00:00', '2015-08-23 14:30:00', 'Maple Ridge Elementary', 3);
/*!40000 ALTER TABLE `session` ENABLE KEYS */;


-- Dumping structure for table candb.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `worker_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `worker_id` (`worker_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`worker_id`) REFERENCES `worker` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table candb.user: ~2 rows (approximately)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `email`, `password`, `type`, `worker_id`) VALUES
	(1, 'anubhavm@test.com', '123123', 'worker', 1),
	(2, 'lukek@test.com', '123123', 'worker', 2);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;


-- Dumping structure for table candb.worker
CREATE TABLE IF NOT EXISTS `worker` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email_address` varchar(255) DEFAULT NULL,
  `first_name` varchar(32) DEFAULT NULL,
  `last_name` varchar(32) DEFAULT NULL,
  `phone_number` varchar(32) DEFAULT NULL,
  `type` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;

-- Dumping data for table candb.worker: ~21 rows (approximately)
DELETE FROM `worker`;
/*!40000 ALTER TABLE `worker` DISABLE KEYS */;
INSERT INTO `worker` (`id`, `email_address`, `first_name`, `last_name`, `phone_number`, `type`) VALUES
	(1, 'anubhavm@test.com', 'Anubhav', 'Mishra', '7788409095', 'Staff'),
	(2, 'lukek@test.com', 'Luke', 'Kysow', '7783932562', 'Volunteer'),
	(3, 'nateng@test.com', 'Nathan', 'Ng', '7788167306', 'Staff'),
	(4, 'owenw@test.com', 'Owen', 'Wu', '7784039677', 'Staff'),
	(5, 'ellah@test.com', 'Ella', 'Ho', '7788781994', 'Staff'),
	(6, 'hannahc@test.com', 'Hannah', 'Campbell', '7783989692', 'Staff'),
	(7, 'ryanc@test.com', 'Ryan', 'Chow', '7784763574', 'Staff'),
	(8, 'hunterm@test.com', 'Hunter', 'McDonald', '7787313582', 'Staff'),
	(9, 'ariam@test.com', 'Aria', 'Miller', '7787109216', 'Staff'),
	(10, 'averyc@test.com', 'Avery', 'Chang', '7782481210', 'Staff'),
	(11, 'jackl@test.com', 'Jack', 'Lin', '7784562764', 'Volunteer'),
	(12, 'isabellac@test.com', 'Isabella', 'Cheung', '7787377732', 'Volunteer'),
	(13, 'islam@test.com', 'Isla', 'Martin', '7784608953', 'Volunteer'),
	(14, 'daniell@test.com', 'Daniel', 'Lau', '7783545717', 'Volunteer'),
	(15, 'jacksony@test.com', 'Jackson', 'Young', '7786313803', 'Volunteer'),
	(16, 'evelynt@test.com', 'Evelyn', 'Thompson', '7784856515', 'Volunteer'),
	(17, 'mias@test.com', 'Mia', 'Scott', '7786833400', 'Volunteer'),
	(18, 'audreyn@test.com', 'Audrey', 'Nguyen', '7785446617', 'Volunteer'),
	(19, 'jaydenh@test.com', 'Jayden', 'Huang', '7788321909', 'Staff'),
	(20, 'mayac@test.com', 'Maya', 'Cheng', '7787181810', 'Volunteer'),
	(21, 'piperj@test.com', 'Piper', 'Jackson', '7787145728', 'Admin');
/*!40000 ALTER TABLE `worker` ENABLE KEYS */;


-- Dumping structure for table candb.worker_attendance
CREATE TABLE IF NOT EXISTS `worker_attendance` (
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

-- Dumping data for table candb.worker_attendance: ~0 rows (approximately)
DELETE FROM `worker_attendance`;
/*!40000 ALTER TABLE `worker_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `worker_attendance` ENABLE KEYS */;


-- Dumping structure for table candb.worker_registration
CREATE TABLE IF NOT EXISTS `worker_registration` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int(11) unsigned DEFAULT NULL,
  `worker_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `worker_id` (`worker_id`),
  CONSTRAINT `worker_registration_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  CONSTRAINT `worker_registration_ibfk_2` FOREIGN KEY (`worker_id`) REFERENCES `worker` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;

-- Dumping data for table candb.worker_registration: ~30 rows (approximately)
DELETE FROM `worker_registration`;
/*!40000 ALTER TABLE `worker_registration` DISABLE KEYS */;
INSERT INTO `worker_registration` (`id`, `session_id`, `worker_id`) VALUES
	(1, 1, 1),
	(2, 1, 2),
	(3, 1, 3),
	(4, 1, 4),
	(5, 1, 5),
	(6, 1, 6),
	(7, 1, 7),
	(8, 1, 8),
	(9, 1, 9),
	(10, 1, 10),
	(11, 2, 1),
	(12, 2, 11),
	(13, 2, 15),
	(14, 2, 16),
	(15, 2, 12),
	(16, 2, 13),
	(17, 2, 14),
	(18, 2, 18),
	(19, 2, 17),
	(20, 2, 19),
	(21, 3, 2),
	(22, 3, 20),
	(23, 3, 17),
	(24, 3, 3),
	(25, 3, 4),
	(26, 3, 7),
	(27, 3, 19),
	(28, 3, 15),
	(29, 3, 11),
	(30, 3, 13);
/*!40000 ALTER TABLE `worker_registration` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
