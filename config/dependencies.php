<?php
declare(strict_types=1);

use Psr\Container\ContainerInterface;
use Salle\TFG\Controller\APIController;
use Salle\TFG\Repository\MySQLUserRepository;
use Salle\TFG\Repository\PDOSingleton;
use Slim\Views\Twig;

function addDependencies(ContainerInterface $container): void {
    $container->set(
        'view',
        function () {
            return Twig::create(__DIR__ . '/../templates', ['cache' => false]);
        }
    );

    $container->set('db', function () {
        return PDOSingleton::getInstance(
            $_ENV['MYSQL_ROOT_USER'],
            $_ENV['MYSQL_ROOT_PASSWORD'],
            $_ENV['MYSQL_HOST'],
            $_ENV['MYSQL_PORT'],
            $_ENV['MYSQL_DATABASE']
        );
    });

    $container->set('user_repository', function (ContainerInterface $container) {
        return new MySQLUserRepository($container->get('db'));
    });

    $container->set(
        APIController::class,
        function (ContainerInterface $c) {
            return new APIController($c->get('user_repository'));
        }
    );
}
