SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

CREATE DATABASE IF NOT EXISTS `tfg`;
USE `tfg`;

DROP TABLE IF EXISTS `battle`;
CREATE TABLE `battle`
(
    `battle_id`     INT             NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`battle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `fight`;
CREATE TABLE `fight`
(
    `date`                  DATE            NOT NULL,
    `quantity_attacker`     INT            NOT NULL,
    `battle_id`             INT             NOT NULL,
    `habitant_id`           INT             NOT NULL,
    `land_id`               INT             NOT NULL,
    PRIMARY KEY  (`battle_id`, `habitant_id`, `land_id`),
    FOREIGN KEY (`battle_id`) REFERENCES battle(`battle_id`),
    FOREIGN KEY (`habitant_id`) REFERENCES habitant(`habitant_id`),
    FOREIGN KEY (`land_id`) REFERENCES land(`land_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `habitant`;
CREATE TABLE `habitant`
(
    `habitant_id`           INT             NOT NULL AUTO_INCREMENT,
    `attacker_damage`       INT             NOT NULL,
    `defender_damage`       INT             NOT NULL,
    `attacker_speed`        INT             NOT NULL,
    `defender_speed`        INT             NOT NULL,
    `velocity`              INT             NOT NULL,
    `type`                  VARCHAR(255)             NOT NULL,
    PRIMARY KEY (`habitant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `construction`;
CREATE TABLE `construction`
(
    `construction_id`   INT             NOT NULL AUTO_INCREMENT,
    `start_date`        DATE            NOT NULL,
    `end_date`          DATE            NOT NULL,
    `building_name`     VARCHAR(255)    NOT NULL,
    `resource_name`     VARCHAR(255)    NOT NULL,
    `land_id`           INT             NOT NULL,
    PRIMARY KEY (`construction_id`),
    FOREIGN KEY (`land_id`) REFERENCES land(`land_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `player`;
CREATE TABLE `player`
(
    `player_id`         INT                     NOT NULL AUTO_INCREMENT,
    `username`          VARCHAR(255)            NOT NULL,
    `password`          VARCHAR(255)            NOT NULL,
    PRIMARY KEY (`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `controls`;
CREATE TABLE `controls`
(
    `player_id`         INT             NOT NULL,
    `land_id`           INT             NOT NULL,
    `date_obtained`     DATE            NOT NULL,
    PRIMARY KEY (`player_id`, `land_id`),
    FOREIGN KEY (`player_id`) REFERENCES player(`player_id`),
    FOREIGN KEY (`land_id`) REFERENCES land(`land_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `land`;
CREATE TABLE `land`
(
    `land_id`       INT             NOT NULL AUTO_INCREMENT,
    `name`          VARCHAR(255)    NOT NULL,
    `wheat`         TEXT            NOT NULL,
    `iron`          INT             NOT NULL,
    `wood`          INT             NOT NULL,
    `stone`         INT             NOT NULL,
    PRIMARY KEY (`land_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ubicate`;
CREATE TABLE `ubicate`
(
    `land_id`       INT          NOT NULL,
    `map_id`        INT          NOT NULL,
    `position_x`    INT          NOT NULL,
    `position_y`    INT          NOT NULL,
    PRIMARY KEY (`map_id`, `land_id`),
    FOREIGN KEY (`map_id`) REFERENCES map(`map_id`),
    FOREIGN KEY (`land_id`) REFERENCES land(`land_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `live_in`;
CREATE TABLE `live_in`
(
    `land_id`       INT     NOT NULL,
    `habitant_id`   INT     NOT NULL,
    `quantity`      INT     NOT NULL,
    PRIMARY KEY (`land_id`, `habitant_id`),
    FOREIGN KEY (`habitant_id`) REFERENCES habitant(`habitant_id`),
    FOREIGN KEY (`land_id`) REFERENCES land(`land_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `map`;
CREATE TABLE `map`
(
    `map_id`        INT             NOT NULL AUTO_INCREMENT,
    `rows`          INT             NOT NULL,
    `columns`       INT             NOT NULL,
    `server_id`     INT             NOT NULL,
    PRIMARY KEY (`map_id`),
    FOREIGN KEY (`server_id`) REFERENCES server(`server_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `server`;
CREATE TABLE `server`
(
    `server_id`     INT             NOT NULL AUTO_INCREMENT,
    `name`          VARCHAR(255)    NOT NULL,
    `start_date`    DATE            NOT NULL,
    `end_date`      DATE            NOT NULL,
    PRIMARY KEY (`server_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `formed_building`;
CREATE TABLE `formed_building`
(
    `land_id`           INT             NOT NULL,
    `building_id`       INT             NOT NULL,
    `level`             INT             NOT NULL,
    PRIMARY KEY (`land_id`, `building_id`),
    FOREIGN KEY (`building_id`) REFERENCES building(`building_id`),
    FOREIGN KEY (`land_id`) REFERENCES land(`land_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `formed_resources`;
CREATE TABLE `formed_resources`
(
    `land_id`           INT             NOT NULL,
    `resource_id`       INT             NOT NULL,
    `level`             INT             NOT NULL,
    PRIMARY KEY (`land_id`, `resource_id`),
    FOREIGN KEY (`resource_id`) REFERENCES resource(`resource_id`),
    FOREIGN KEY (`land_id`) REFERENCES land(`land_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `building`;
CREATE TABLE `building`
(
    `building_id`       INT             NOT NULL AUTO_INCREMENT,
    `type`              VARCHAR(255)    NOT NULL,
    `image_url`         VARCHAR(255)    NOT NULL,
    `max_level`         INT             NOT NULL,
    PRIMARY KEY (`building_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `level_up_building`;
CREATE TABLE `level_up_building`
(
    `building_id`     INT           NOT NULL,
    `upgrade_id`      INT           NOT NULL,
    `cost_wheat`    INT             NOT NULL,
    `cost_iron`     INT             NOT NULL,
    `cost_wood`     INT             NOT NULL,
    `cost_stone`    INT             NOT NULL,
    `cost_time`     TIME            NOT NULL,
    PRIMARY KEY (`building_id`, `upgrade_id`),
    FOREIGN KEY (`building_id`) REFERENCES building(`building_id`),
    FOREIGN KEY (`upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `level_up_resource`;
CREATE TABLE `level_up_resource`
(
    `resource_id`     INT           NOT NULL,
    `upgrade_id`      INT           NOT NULL,
    `cost_wheat`    INT             NOT NULL,
    `cost_iron`     INT             NOT NULL,
    `cost_wood`     INT             NOT NULL,
    `cost_stone`    INT             NOT NULL,
    `cost_time`     TIME            NOT NULL,
    PRIMARY KEY (`resource_id`, `upgrade_id`),
    FOREIGN KEY (`resource_id`) REFERENCES resource(`resource_id`),
    FOREIGN KEY (`upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `upgrade`;
CREATE TABLE `upgrade`
(
    `upgrade_id`    INT             NOT NULL,
    `level`         INT             NOT NULL,
    PRIMARY KEY (`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource`
(
    `resource_id`       INT             NOT NULL AUTO_INCREMENT,
    `type`              VARCHAR(255)    NOT NULL,
    `max_level`         INT             NOT NULL,
    PRIMARY KEY (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `castle_upgrade`;
CREATE TABLE `castle_upgrade`
(
    `castle_upgrade_id`             INT             NOT NULL,
    `discount_buildings`            INT             NOT NULL,
    `bonus_resources_per_hour`      INT             NOT NULL,
    PRIMARY KEY (`castle_upgrade_id`),
    FOREIGN KEY (`castle_upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `training_upgrade`;
CREATE TABLE `training_upgrade`
(
    `training_upgrade_id`               INT             NOT NULL,
    `velocity_training_troops`          TIME            NOT NULL,
    `cost_training_troops`              INT             NOT NULL,
    PRIMARY KEY (`training_upgrade_id`),
    FOREIGN KEY (`training_upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `noble_upgrade`;
CREATE TABLE `noble_upgrade`
(
    `noble_upgrade_id`                  INT             NOT NULL,
    `mobility_velocity_bonus`           INT             NOT NULL,
    PRIMARY KEY (`noble_upgrade_id`),
    FOREIGN KEY (`noble_upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `wall_upgrade`;
CREATE TABLE `wall_upgrade`
(
    `wall_upgrade_id`              INT             NOT NULL,
    `defend_bonus`                 INT             NOT NULL,
    PRIMARY KEY (`wall_upgrade_id`),
    FOREIGN KEY (`wall_upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `church_upgrade`;
CREATE TABLE `church_upgrade`
(
    `church_upgrade_id`                INT             NOT NULL,
    `attacker_damage_bonus`            INT             NOT NULL,
    PRIMARY KEY (`church_upgrade_id`),
    FOREIGN KEY (`church_upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `resource_upgrade`;
CREATE TABLE `resource_upgrade`
(
    `resource_upgrade_id`           INT             NOT NULL,
    `resource_per_hour`             INT             NOT NULL,
    PRIMARY KEY (`resource_upgrade_id`),
    FOREIGN KEY (`resource_upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO building(TYPE, IMAGE_URL, MAX_LEVEL)
VALUES ('Church', 'https://cdn.pixabay.com/photo/2016/03/27/19/47/water-1283963_960_720.jpg', 10),
       ('Castle', 'https://cdn.pixabay.com/photo/2016/03/27/19/47/water-1283963_960_720.jpg', 10),
       ('Training', 'https://cdn.pixabay.com/photo/2016/03/27/19/47/water-1283963_960_720.jpg', 10),
       ('Noble', 'https://cdn.pixabay.com/photo/2016/03/27/19/47/water-1283963_960_720.jpg', 10),
       ('Wall', 'https://cdn.pixabay.com/photo/2016/03/27/19/47/water-1283963_960_720.jpg', 10);

INSERT INTO resource(TYPE, MAX_LEVEL)
VALUES ('Wood', 10),
       ('Wheat', 10),
       ('Stone', 10),
       ('Iron', 10);

INSERT INTO habitant(ATTACKER_DAMAGE, DEFENDER_DAMAGE, ATTACKER_SPEED, DEFENDER_SPEED, VELOCITY, TYPE)
VALUES (10, 10, 1, 1, 10, 'Knight'),
       (0, 10, 1, 1, 10, 'Defender'),
       (10, 0, 1, 1, 10, 'Attacker');

INSERT INTO upgrade(UPGRADE_ID, LEVEL)
VALUES (1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (8, 8), (9, 9), (10, 10),
       (11, 1), (12, 2), (13, 3), (14, 4), (15, 5), (16, 6), (17, 7), (18, 8), (19, 9), (20, 10),
       (21, 1), (22, 2), (23, 3), (24, 4), (25, 5), (26, 6), (27, 7), (28, 8), (29, 9), (30, 10),
       (31, 1), (32, 2), (33, 3), (34, 4), (35, 5), (36, 6), (37, 7), (38, 8), (39, 9), (40, 10),
       (41, 1), (42, 2), (43, 3), (44, 4), (45, 5), (46, 6), (47, 7), (48, 8), (49, 9), (50, 10),
       (51, 1), (52, 2), (53, 3), (54, 4), (55, 5), (56, 6), (57, 7), (58, 8), (59, 9), (60, 10),
       (61, 1), (62, 2), (63, 3), (64, 4), (65, 5), (66, 6), (67, 7), (68, 8), (69, 9), (70, 10),
       (71, 1), (72, 2), (73, 3), (74, 4), (75, 5), (76, 6), (77, 7), (78, 8), (79, 9), (80, 10),
       (81, 1), (82, 2), (83, 3), (84, 4), (85, 5), (86, 6), (87, 7), (88, 8), (89, 9), (90, 10);

INSERT INTO castle_upgrade(CASTLE_UPGRADE_ID, DISCOUNT_BUILDINGS, BONUS_RESOURCES_PER_HOUR)
VALUES (1, 100, 10), (2, 200, 10), (3, 500, 20), (4, 550, 20), (5, 600, 30), (6, 700, 30), (7, 750, 35), (8, 800, 40), (9, 900, 50), (10, 10000, 60);

INSERT INTO training_upgrade(TRAINING_UPGRADE_ID, VELOCITY_TRAINING_TROOPS, COST_TRAINING_TROOPS)
VALUES (11, '00:10:00', 200), (12, '00:09:00', 200), (13, '00:08:30', 200), (14, '00:08:00', 150), (15, '00:07:00', 150),
       (16, '00:06:00', 100), (17, '00:06:30', 75), (18, '00:05:30', 50), (19, '00:05:00', 25), (20, '00:04:00', 20);

INSERT INTO noble_upgrade(NOBLE_UPGRADE_ID, MOBILITY_VELOCITY_BONUS)
VALUES (21, 1), (22, 2), (23, 5), (24, 5), (25, 6), (26, 7), (27, 7), (28, 8), (29, 9), (30, 10);

INSERT INTO wall_upgrade(WALL_UPGRADE_ID, DEFEND_BONUS)
VALUES (31, 100), (32, 200), (33, 500), (34, 500), (35, 600), (36, 700), (37, 700), (38, 800), (39, 900), (40, 1000);

INSERT INTO church_upgrade(CHURCH_UPGRADE_ID, ATTACKER_DAMAGE_BONUS)
VALUES (41, 5), (42, 6), (43, 8), (44, 10), (45, 12), (46, 15), (47, 17), (48, 20), (49, 22), (50, 25);

INSERT INTO resource_upgrade(RESOURCE_UPGRADE_ID, RESOURCE_PER_HOUR)
VALUES (51, 10), (52, 15), (53, 20), (54, 25), (55, 30), (56, 40), (57, 60), (58, 80), (59, 100), (60, 150);

INSERT INTO level_up_building(BUILDING_ID, UPGRADE_ID, COST_IRON, COST_WHEAT, COST_WOOD, COST_STONE, COST_TIME)
VALUES ((SELECT BUILDING_ID FROM building WHERE type = 'Castle'), 1, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Castle'), 2, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Castle'), 3, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Castle'), 4, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Castle'), 5, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Castle'), 6, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Castle'), 7, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Castle'), 8, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Castle'), 9, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Castle'), 10, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Training'), 11, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Training'), 12, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Training'), 13, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Training'), 14, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Training'), 15, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Training'), 16, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Training'), 17, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Training'), 18, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Training'), 19, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Training'), 20, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Noble'), 21, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Noble'), 22, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Noble'), 23, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Noble'), 24, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Noble'), 25, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Noble'), 26, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Noble'), 27, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Noble'), 28, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Noble'), 29, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Noble'), 30, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Wall'), 31, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Wall'), 32, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Wall'), 33, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Wall'), 34, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Wall'), 35, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Wall'), 36, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Wall'), 37, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Wall'), 38, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Wall'), 39, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Wall'), 40, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Church'), 41, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Church'), 42, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Church'), 43, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Church'), 44, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Church'), 45, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Church'), 46, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Church'), 47, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Church'), 48, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Church'), 49, 100, 80, 100, 100, '00:05:00'),
       ((SELECT BUILDING_ID FROM building WHERE type = 'Church'), 50, 100, 80, 100, 100, '00:05:00');


INSERT INTO level_up_resource(RESOURCE_ID, UPGRADE_ID, COST_IRON, COST_WHEAT, COST_WOOD, COST_STONE, COST_TIME)
VALUES ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wood'), 51, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wood'), 52, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wood'), 53, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wood'), 54, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wood'), 55, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wood'), 56, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wood'), 57, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wood'), 58, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wood'), 59, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wood'), 60, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wheat'), 61, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wheat'), 62, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wheat'), 63, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wheat'), 64, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wheat'), 65, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wheat'), 66, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wheat'), 67, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wheat'), 68, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wheat'), 69, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Wheat'), 70, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Iron'), 71, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Iron'), 72, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Iron'), 73, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Iron'), 74, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Iron'), 75, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Iron'), 76, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Iron'), 77, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Iron'), 78, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Iron'), 79, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Iron'), 80, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Stone'), 81, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Stone'), 82, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Stone'), 83, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Stone'), 84, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Stone'), 85, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Stone'), 86, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Stone'), 87, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Stone'), 88, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Stone'), 89, 100, 80, 100, 100, '00:05:00'),
       ((SELECT RESOURCE_ID FROM resource WHERE type = 'Stone'), 90, 100, 80, 100, 100, '00:05:00');




