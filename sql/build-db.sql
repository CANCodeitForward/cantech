CREATE TABLE User (id INT(11) key, master_id INT(11), role_in_family VARCHAR(32), has_asd TINYINT(1), email_address VARCHAR(64), gender VARCHAR(8), photo_path VARCHAR(64), first_name VARCHAR(32), last_name VARCHAR(32), date_of_birth DATE, notes VARCHAR(5120), phone_id INT(11), emergency_contact1_id INT(11), emergency_contact2_id INT(11));

CREATE TABLE EmergencyContact (id INT(11) key, first_name VARCHAR(32), last_name VARCHAR(32), phone_id INT(11), relationship VARCHAR(32));

CREATE TABLE Program (id INT(11) key, number INT(11), type_id INT(11), category_id INT(11), enabled TINYINT(1), name VARCHAR(255), description VARCHAR(1024), visibility_period INT(11), prerequisite_for_id INT(11), additional_survey_id INT(11), supervisor_id INT(11));

CREATE TABLE Class (id INT(11) key, session_id INT(11), venue_id INT(11), supervisor_id INT(11), datetime_start DATETIME, datetime_end DATETIME);

CREATE TABLE Venue (id INT(11) key, name VARCHAR(255), address_id INT(11), phone_id INT(11), description VARCHAR(1024));

CREATE TABLE Term (id INT(11) key, name VARCHAR(32), datetime_start DATETIME, datetime_end DATETIME, registration_start DATETIME, gistration_end DATETIME, enabled TINYINT(1), description VARCHAR(255));

CREATE TABLE Session (id INT(11) key, enabled TINYINT(1), datetime_start DATETIME, datetime_end DATETIME, registration_start DATETIME, registration_end DATETIME, age_min INT(11), age_max INT(11), region_id INT(11), registration_max INT(11), open_registration_max INT(11), participation_type VARCHAR(32), description VARCHAR(1024));

CREATE TABLE Registration (id INT(11) key, user_id INT(11), session_id INT(11), status VARCHAR(32), attended TINYINT(1), created_by_user_id INT(11), datetime_created DATETIME);

# our own DB
CREATE TABLE `Session` (
  `id` int(11) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Attendance` (
  `id` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `participant_id` int(11) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `type` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`),
  KEY `participant_id` (`participant_id`),
  CONSTRAINT `Attendance_ibfk_2` FOREIGN KEY (`participant_id`) REFERENCES `Participant` (`id`),
  CONSTRAINT `Attendance_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `Class` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Class` (
  `id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  CONSTRAINT `Class_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `Session` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Participant` (
  `id` int(11) NOT NULL,
  `email_address` varchar(64) DEFAULT NULL,
  `gender` varchar(8) DEFAULT NULL,
  `first_name` varchar(32) DEFAULT NULL,
  `last_name` varchar(32) DEFAULT NULL,
  `phone_id` int(11) DEFAULT NULL,
  `emergency_contact1_id` int(11) DEFAULT NULL,
  `emergency_contact2_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Registration` (
  `id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `participant_id` int(11) DEFAULT NULL,
  `status` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `participant_id` (`participant_id`),
  CONSTRAINT `Registration_ibfk_2` FOREIGN KEY (`participant_id`) REFERENCES `Participant` (`id`),
  CONSTRAINT `Registration_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `Session` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
