<?php

declare(strict_types=1);

namespace Salle\TFG\Repository;

use PDO;
use Salle\TFG\Model\User;

final class MySQLUserRepository implements UserRepository {
    private PDOSingleton $database;

    public function __construct(PDOSingleton $database) {
        $this->database = $database;
    }

    public function createUser(User $user): int {
        $query = <<<'QUERY'
        INSERT INTO user(email, password)
        VALUES(:email, :password)
        QUERY;

        $statement = $this->database->connection()->prepare($query);

        $email = $user->email();
        $password = password_hash($user->password(), PASSWORD_BCRYPT);

        $statement->bindParam('email', $email, PDO::PARAM_STR);
        $statement->bindParam('password', $password, PDO::PARAM_STR);

        $statement->execute();
        $id = $this->database->connection()->lastInsertId();
        return (int) $id;
    }

    public function updateUser(int $id, User $user): bool {
        return true;
    }

    public function getUser(int $id) {
        return new User("", "");
    }

    public function getUsers(): array {
        return array();
    }

    public function deleteUser(int $id): bool {
        return true;
    }
}
