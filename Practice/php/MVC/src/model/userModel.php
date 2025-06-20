<?php
require_once __DIR__ . "/../config/config.php";
// require_once __DIR__ . "/authManager.php";

/* 
createUser
getAllUsers
getUserByUsername
UpdateUser
deleteUser
isUserAdmin
*/

function getUserById(int $id): ?array
{
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    return $user ?: null;
}
function getUserByMail(string $mail): ?array
{
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE mail = :mail");
    $stmt->bindValue(':mail', $mail, PDO::PARAM_STR);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    return $user ?: null;
}
function getAllUsers(): array
{
    $pdo = getDbConnection();
    $stmt = $pdo->query("SELECT * FROM users");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function addUser(string $name, string $mail, string $password, int $privilegeId): bool
{
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("INSERT INTO users (name, mail, password, id_privilege) VALUES (:name, :mail, :password, :privilegeId)");
    $stmt->bindValue(':name', $name, PDO::PARAM_STR);
    $stmt->bindValue(':mail', $mail, PDO::PARAM_STR);
    $stmt->bindValue(':password', password_hash($password, PASSWORD_DEFAULT), PDO::PARAM_STR);
    $stmt->bindValue(':privilegeId', $privilegeId, PDO::PARAM_INT);
    
    return $stmt->execute();
}
function updateUser(int $id, string $name, string $mail, ?string $password = null, int $privilegeId): bool
{
    $pdo = getDbConnection();
    $query = "UPDATE users SET name = :name, mail = :mail, id_privilege = :privilegeId";
    
    if ($password !== null) {
        $query .= ", password = :password";
    }
    
    $query .= " WHERE id = :id";
    
    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':name', $name, PDO::PARAM_STR);
    $stmt->bindValue(':mail', $mail, PDO::PARAM_STR);
    if ($password !== null) {
        $stmt->bindValue(':password', password_hash($password, PASSWORD_DEFAULT), PDO::PARAM_STR);
    }
    $stmt->bindValue(':privilegeId', $privilegeId, PDO::PARAM_INT);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    
    return $stmt->execute();
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
function deleteUser(int $id): bool
{
    $pdo = getDbConnection();
    if (isUserAdmin($id)) {
        return false;
    } else if ($id === getConnectedUserId()) {
        return false;
    } else {
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    
    return $stmt->execute();}
}
