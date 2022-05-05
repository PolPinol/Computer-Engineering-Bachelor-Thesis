<?php

declare(strict_types=1);

namespace Salle\TFG\Repository;

use OAuthProvider;
use PDO;
use Salle\TFG\Model\User;

final class MySQLUserRepository implements UserRepository {
    private PDOSingleton $database;

    public function __construct(PDOSingleton $database) {
        $this->database = $database;
    }

    public function createUser(User $user): int {
        // Creat auth token
        $token = base64_encode($user->email() . ":" . $user->password());

        $query = <<<'QUERY'
        INSERT INTO user(email, password, token)
        VALUES(:email, :password, :token)
        QUERY;

        $statement = $this->database->connection()->prepare($query);

        $email = $user->email();
        $password = password_hash($user->password(), PASSWORD_BCRYPT);

        $statement->bindParam('email', $email, PDO::PARAM_STR);
        $statement->bindParam('password', $password, PDO::PARAM_STR);
        $statement->bindParam('token', $token, PDO::PARAM_STR);

        $statement->execute();
        $id = $this->database->connection()->lastInsertId();
        return (int) $id;
    }

    public function updateUser(int $id, User $user): bool {
        $query = <<<'QUERY'
        UPDATE user SET email = :email, password = :password WHERE id = :id;
        QUERY;

        $statement = $this->database->connection()->prepare($query);

        $email = $user->email();
        $password = $user->password();

        $statement->bindParam('id', $id, PDO::PARAM_STR);
        $statement->bindParam('email', $email, PDO::PARAM_STR);
        $statement->bindParam('password', $password, PDO::PARAM_STR);

        $statement->execute();
        $rows = $statement->rowCount();
        return $rows == 1;
    }

    public function getUser(int $id) {
        $query = <<<'QUERY'
        SELECT * FROM user WHERE id = :id
        QUERY;

        $statement = $this->database->connection()->prepare($query);
        $statement->bindParam('id', $id, PDO::PARAM_STR);
        $statement->execute();

        if ($statement->rowCount() > 0) {
            return $statement->fetch(PDO::FETCH_OBJ);
        }
        return null;
    }

    public function getUsers(): array {
        $query = <<<'QUERY'
        SELECT * FROM user
        QUERY;

        $statement = $this->database->connection()->prepare($query);
        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteUser(int $id): bool {
        $query = <<<'QUERY'
        DELETE FROM user WHERE id = :id
        QUERY;

        $statement = $this->database->connection()->prepare($query);
        $statement->bindParam('id', $id, PDO::PARAM_STR);

        $statement->execute();
        $rows = $statement->rowCount();
        return $rows == 1;
    }

    public function getAuthToken(int $id): string {
        $query = <<<'QUERY'
        SELECT token FROM user WHERE id = :id
        QUERY;

        $statement = $this->database->connection()->prepare($query);
        $statement->bindParam('id', $id, PDO::PARAM_STR);
        $statement->execute();

        if ($statement->rowCount() > 0) {
            return $statement->fetch(PDO::FETCH_OBJ)->token;
        }
        return "ERROR";
    }
}
