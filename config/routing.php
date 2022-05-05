<?php

declare(strict_types=1);

use Salle\TFG\Controller\APIController;
use Slim\App;

function addRoutes(App $app): void {
    // ENDPOINTS Users
    $app->get('/api/users', APIController::class . ':getUsers');
    $app->get('/api/users/auth', APIController::class . ':authUser');
    $app->get('/api/users/{id}', APIController::class . ':getUser');
    $app->post('/api/users', APIController::class . ':postUser');
    $app->put('/api/users/{id}', APIController::class . ':updateUser');
    $app->delete('/api/users/{id}', APIController::class . ':deleteUser');
}
