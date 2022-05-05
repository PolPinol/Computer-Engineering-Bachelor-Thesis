SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

CREATE DATABASE IF NOT EXISTS `tfg`;
USE `tfg`;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`
(
    `id`         INT                                                     NOT NULL AUTO_INCREMENT,
    `email`      VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    `password`   VARCHAR(255)                                            NOT NULL,
    PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;