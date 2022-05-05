<?php
declare(strict_types=1);
namespace Salle\TFG\Controller;

use Salle\TFG\Model\User;
use Salle\TFG\Repository\UserRepository;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

final class APIController {
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository) {
        $this->userRepository = $userRepository;
    }

    public function getUsers(Request $request, Response $response, $args): Response {
        $statusCode = 200;
        $message = $this->userRepository->getUsers();

        $response->getBody()->write(json_encode($message,JSON_UNESCAPED_SLASHES));

        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus($statusCode);
    }

    public function getUser(Request $request, Response $response, $args): Response {
        $id = implode("|", $args);
        $user = $this->userRepository->getUser((int) $id);

        if ($user != null) {
            $statusCode = 200;
            $message = $user;
        } else {
            $statusCode = 404;
            $message = array("message" => "User entry with id $id does not exist.");
        }

        $response->getBody()->write(json_encode($message,JSON_UNESCAPED_SLASHES));

        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus($statusCode);
    }

    public function postUser(Request $request, Response $response, $args): Response {
        $data = (string) $request->getBody();
        $parameters = json_decode($data);

        if (!isset($parameters->email) || !isset($parameters->password)) {
            $statusCode = 400;
            $message = array("message" => "'email' and/or 'password' key missing.");
        } else {
            $user = new User($parameters->email, $parameters->password);
            $id = $this->userRepository->createUser($user);
            $token = $this->userRepository->getAuthToken($id);

            $message = array('token'    => $token);
            $statusCode = 201;
        }

        $response->getBody()->write(json_encode($message,JSON_UNESCAPED_SLASHES));

        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus($statusCode);
    }

    public function updateUser(Request $request, Response $response, $args): Response {
        $id = implode("|", $args);
        $data = (string) $request->getBody();
        $parameters = json_decode($data);

        if (!isset($parameters->email) || !isset($parameters->password)) {
            $statusCode = 400;
            $message = array("message" => "'email' and/or 'password' key missing.");
        } else {
            $user = new User($parameters->email, $parameters->password);
            $validate = $this->userRepository->updateUser((int) $id, $user);

            if ($validate == 1) {
                $statusCode = 200;
                $message = array("message" => "User entry with id $id was successfully updated.");
            } else {
                $statusCode = 404;
                $message = array("message" => "User entry with id $id does not exist.");
            }
        }

        $response->getBody()->write(json_encode($message,JSON_UNESCAPED_SLASHES));

        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus($statusCode);
    }

    public function deleteUser(Request $request, Response $response, $args): Response {
        $id = implode("|", $args);
        $validate = $this->userRepository->deleteUser((int) $id);

        if ($validate == 1) {
            $statusCode = 200;
            $message = array("message" => "User entry with id $id was successfully deleted.");
        } else {
            $statusCode = 404;
            $message = array("message" => "User entry with id $id does not exist.");
        }

        $response->getBody()->write(json_encode($message,JSON_UNESCAPED_SLASHES));

        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus($statusCode);
    }
}