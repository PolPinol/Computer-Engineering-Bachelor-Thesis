<?php

declare(strict_types=1);

namespace Salle\TFG\Repository;

use Salle\TFG\Model\User;

interface UserRepository {
    public function createUser(User $user): int;
    public function updateUser(int $id, User $user): bool;
    public function getUser(int $id);
    public function getUsers(): array;
    public function deleteUser(int $id): bool;
    public function getAuthToken(int $id): string;
}
