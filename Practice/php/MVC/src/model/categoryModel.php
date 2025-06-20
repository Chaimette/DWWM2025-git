<?php
require_once __DIR__."../../../config/config.php";

/* 
addCategory
getAllCategories
getCategoryById
deleteCategory
*/

function getUserByMail(string $mail): ?array
{
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE mail = :mail");
    $stmt->bindValue(':mail', $mail, PDO::PARAM_STR);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    return $user ?: null;
}

function getUserById(int $id): ?array
{
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    return $user ?: null;
}

function isUserAdmin(int $user_id): bool
{
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("SELECT p.name FROM users u JOIN privilege p ON u.id_privilege = p.id WHERE u.id = :user_id");
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $priv = $stmt->fetch(PDO::FETCH_ASSOC);
    return $priv && $priv['name'] === 'ADMIN';
}


