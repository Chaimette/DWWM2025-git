<?php
require_once __DIR__ . "/../config/config.php";
require_once __DIR__ . "/../model/authManager.php";

function connectUser(string $mail, string $password): ?array
{
    $user = getUserByMail($mail);
    if (!$user || !password_verify($password, $user['password'])) {
        return null;
    }

    $_SESSION['user_id'] = $user['id'];
    return $user;
}

function isUserConnected(): bool
{
    return isset($_SESSION['user_id']);
}

function getConnectedUser(): ?array
{
    if (!isUserConnected()) {
        return null;
    }
    return getUserById($_SESSION['user_id']);
}

function getConnectedUserId(): ?int
{
    return isUserConnected() ? $_SESSION['user_id'] : null;
}

function getConnectedUserMail(): ?string
{
    $user = getConnectedUser();
    return $user ? $user['mail'] : null;
}
function getConnectedUserName(): ?string
{
    $user = getConnectedUser();
    return $user ? $user['name'] : null;
}

function disconnectUser(): void
{
    session_unset();
    session_destroy();
}

function isUserAdmin(): bool
{
    if (!isUserConnected()) {
        return false;
    }
    return isUserAdmin($_SESSION['user_id']);
}
