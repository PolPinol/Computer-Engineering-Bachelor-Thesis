SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

CREATE DATABASE IF NOT EXISTS `gameTFG`;
USE `gameTFG`;

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
    `quantity_attacker`     TEXT            NOT NULL,
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
    `defender_damage`      TEXT            NOT NULL,
    `attacker_speed`        INT             NOT NULL,
    `defender_speed`       INT             NOT NULL,
    `velocity`              INT             NOT NULL,
    `type`                  INT             NOT NULL,
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
    PRIMARY KEY (`building_id`, `upgrade_id`),
    FOREIGN KEY (`building_id`) REFERENCES building(`building_id`),
    FOREIGN KEY (`upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `level_up_resource`;
CREATE TABLE `level_up_resource`
(
    `resource_id`     INT           NOT NULL,
    `upgrade_id`      INT           NOT NULL,
    PRIMARY KEY (`resource_id`, `upgrade_id`),
    FOREIGN KEY (`resource_id`) REFERENCES resource(`resource_id`),
    FOREIGN KEY (`upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `upgrade`;
CREATE TABLE `upgrade`
(
    `upgrade_id`    INT             NOT NULL AUTO_INCREMENT,
    `level`         INT             NOT NULL,
    `cost_wheat`    INT             NOT NULL,
    `cost_iron`     INT             NOT NULL,
    `cost_wood`     INT             NOT NULL,
    `cost_stone`    INT             NOT NULL,
    `cost_time`     TIME            NOT NULL,
    PRIMARY KEY (`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource`
(
    `resource_id`       INT             NOT NULL AUTO_INCREMENT,
    `type`              INT             NOT NULL,
    `max_level`         INT             NOT NULL,
    `battle_id`         INT             NOT NULL,
    PRIMARY KEY (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `castle_upgrade`;
CREATE TABLE `castle_upgrade`
(
    `castle_upgrade_id`             INT             NOT NULL AUTO_INCREMENT,
    `discount_buildings`            INT             NOT NULL,
    `bonus_resources_per_hour`      INT             NOT NULL,
    PRIMARY KEY (`castle_upgrade_id`),
    FOREIGN KEY (`castle_upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `training_upgrade`;
CREATE TABLE `training_upgrade`
(
    `training_upgrade_id`               INT             NOT NULL AUTO_INCREMENT,
    `velocity_training_troops`          INT             NOT NULL,
    `cost_training_troops`              INT             NOT NULL,
    PRIMARY KEY (`training_upgrade_id`),
    FOREIGN KEY (`training_upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `noble_upgrade`;
CREATE TABLE `noble_upgrade`
(
    `noble_upgrade_id`                  INT             NOT NULL AUTO_INCREMENT,
    `mobility_velocity_bonus`           INT             NOT NULL,
    PRIMARY KEY (`noble_upgrade_id`),
    FOREIGN KEY (`noble_upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `wall_upgrade`;
CREATE TABLE `wall_upgrade`
(
    `wall_upgrade_id`               INT             NOT NULL AUTO_INCREMENT,
    `defend_bonus`                 INT             NOT NULL,
    PRIMARY KEY (`wall_upgrade_id`),
    FOREIGN KEY (`wall_upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `church_upgrade`;
CREATE TABLE `church_upgrade`
(
    `church_upgrade_id`                INT             NOT NULL AUTO_INCREMENT,
    `attacker_damage_bonus`            INT             NOT NULL,
    PRIMARY KEY (`church_upgrade_id`),
    FOREIGN KEY (`church_upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `resource_upgrade`;
CREATE TABLE `resource_upgrade`
(
    `resource_upgrade_id`           INT             NOT NULL AUTO_INCREMENT,
    `resource_per_hour`             INT             NOT NULL,
    PRIMARY KEY (`resource_upgrade_id`),
    FOREIGN KEY (`resource_upgrade_id`) REFERENCES upgrade(`upgrade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;