CREATE DATABASE `safe_sri_lanka`;
-- host = localhost
-- username = root
-- password = root
-- port = 3306

USE safe_sri_lanka;

CREATE TABLE `profile` (
  `id` int AUTO_INCREMENT,
  `name` varchar(50),
  `mobile` char(10),
  `whatsapp` char(10),
  `email` varchar(50),
  `location` varchar(50),
  `profileImage` varchar(255),
  PRIMARY KEY (`id`)
);

DELIMITER //
CREATE PROCEDURE InsertProfile(
  IN p_name VARCHAR(50),
  IN p_mobile CHAR(10),
  IN p_whatsapp CHAR(10),
  IN p_email VARCHAR(50),
  IN p_location VARCHAR(50),
  IN p_profileImage VARCHAR(255),
  OUT p_inserted_id INT
)
BEGIN
  INSERT INTO `profile` (`name`, `mobile`, `whatsapp`, `email`, `location`, `profileImage`)
  VALUES (p_name, p_mobile, p_whatsapp, p_email, p_location, p_profileImage);
  
  SET p_inserted_id = LAST_INSERT_ID();
END //
DELIMITER ;

CREATE TABLE `trace` (
  `id` int,
  `timestamp` timestamp,
  `location` varchar(50),
  PRIMARY KEY (`id`, `timestamp`),
  FOREIGN KEY (`id`) REFERENCES `profile`(`id`)
);

CREATE TABLE `danger_zone` (
  `id` int,
  `lat` decimal(10,8),
  `lon` decimal(10,8),
  `description` varchar(250),
  PRIMARY KEY (`id`)
);

CREATE TABLE `current_location` (
  `id` int,
  `lat` decimal(10,8),
  `lon` decimal(10,8),
  PRIMARY KEY (`id`)
);

CREATE TABLE `relationship` (
  `user1` int,
  `user2` int,
  PRIMARY KEY (`user1`, `user2`),
  FOREIGN KEY (`user1`) REFERENCES `profile`(`id`),
  FOREIGN KEY (`user2`) REFERENCES `profile`(`id`)
);

CREATE TABLE `sos_signal` (
  `id` int AUTO_INCREMENT,
  `sender_id` int,
  `lat` decimal(10,8),
  `lon` decimal(10,8),
  `timestamp` timestamp DEFAULT CURRENT_TIMESTAMP,
  `is_active` boolean DEFAULT TRUE,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`sender_id`) REFERENCES `profile`(`id`)
);

USE safe_sri_lanka;

-- Sahan Mudunkotowa (already provided)
CALL InsertProfile('Sahan Mudunkotowa', '0711234567', '0711234567', 'sahan@example.com', 'Colombo', 'http://16.170.245.231:8080/Desktop/images/sahan.png', @inserted_id);
SELECT @inserted_id AS new_id;

-- Kasun Perera
CALL InsertProfile('Kasun Perera', '0712345678', '0712345678', 'kasun@example.com', 'Kandy', 'http://16.170.245.231:8080/Desktop/images/kasun.png', @inserted_id);
SELECT @inserted_id AS new_id;

-- Nuwan Silva
CALL InsertProfile('Nuwan Silva', '0713456789', '0713456789', 'nuwan@example.com', 'Galle', 'http://16.170.245.231:8080/Desktop/images/nuwan.png', @inserted_id);
SELECT @inserted_id AS new_id;

-- Amaya Fernando
CALL InsertProfile('Amaya Fernando', '0714567890', '0714567890', 'amaya@example.com', 'Matara', 'http://16.170.245.231:8080/Desktop/images/amaya.png', @inserted_id);
SELECT @inserted_id AS new_id;

-- Tharindu Jayasinghe
CALL InsertProfile('Tharindu Jayasinghe', '0715678901', '0715678901', 'tharindu@example.com', 'Jaffna', 'http://16.170.245.231:8080/Desktop/images/tharindu.png', @inserted_id);
SELECT @inserted_id AS new_id;

-- Ishani Wijesinghe
CALL InsertProfile('Ishani Wijesinghe', '0716789012', '0716789012', 'ishani@example.com', 'Negombo', 'http://16.170.245.231:8080/Desktop/images/ishani.png', @inserted_id);
SELECT @inserted_id AS new_id;


INSERT INTO `trace` (`id`, `timestamp`, `location`) 
VALUES 
(1, '2024-10-14 10:00:00', 'Colombo'),
(1, '2024-10-14 12:00:00', 'Dehiwala'),
(2, '2024-10-14 11:00:00', 'Kandy'),
(3, '2024-10-14 10:30:00', 'Galle'),
(4, '2024-10-14 13:00:00', 'Matara'),
(5, '2024-10-14 14:00:00', 'Jaffna'),
(6, '2024-10-14 09:30:00', 'Negombo');

INSERT INTO `danger_zone` (`id`, `lat`, `lon`, `description`) 
VALUES 
(1, 6.927079, 79.861244, 'High accident area near Colombo Fort'),
(2, 7.290572, 80.633726, 'Flood-prone area in Kandy'),
(3, 6.914722, 79.9725, 'Landslide-prone area in Nugegoda'),
(4, 6.053519, 80.221009, 'Tsunami-prone area in Galle'),
(5, 9.661500, 80.025500, 'War-affected area in Jaffna'),
(6, 7.208839, 79.835220, 'Cyclone-prone area in Negombo');

INSERT INTO `current_location` (`id`, `lat`, `lon`) 
VALUES 
(1, 6.927079, 79.861244),
(2, 7.290572, 80.633726),
(3, 6.053519, 80.221009),
(4, 5.948510, 80.535280),
(5, 9.661500, 80.025500),
(6, 7.208839, 79.835220);

INSERT INTO `relationship` (`user1`, `user2`) 
VALUES 
(1, 2), 
(2, 1),
(1, 3),
(3, 1),
(2, 4),
(4, 2),
(3, 5),
(5, 3),
(4, 6),
(6, 4);
