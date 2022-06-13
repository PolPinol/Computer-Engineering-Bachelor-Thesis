<?php
declare(strict_types=1);

use DI\Container;
use Salle\TFG\Middleware\HttpErrorHandler;
use Slim\Factory\AppFactory;
use Slim\Views\TwigMiddleware;
use Symfony\Component\Dotenv\Dotenv;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/dependencies.php';
require_once __DIR__ . '/../config/routing.php';

$dotenv = new Dotenv();

$dotenv->load(__DIR__ . '/../.env');

$container = new Container();

addDependencies($container);

AppFactory::setContainer($container);

$app = AppFactory::create();

$callableResolver = $app->getCallableResolver();

$responseFactory = $app->getResponseFactory();

$app->add(TwigMiddleware::createFromContainer($app));

$app->addRoutingMiddleware();

$app->add(new Slim\Middleware\MethodOverrideMiddleware);

$errorMiddleware = $app->addErrorMiddleware(true, false, false);

$errorHandler = new HttpErrorHandler($callableResolver, $responseFactory);

$errorMiddleware->setDefaultErrorHandler($errorHandler);

addRoutes($app);

$app->run();