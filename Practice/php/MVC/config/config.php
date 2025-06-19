<?php

require_once "./configperso.php";
function getDbConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8";
        $pdo = new PDO($dsn, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        die("Erreur de connexion à la base de données : " . $e->getMessage());
    }
}

function isUserAdmin($user_id) {
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("SELECT p.name FROM users u JOIN privilege p ON u.id_privilege = p.id WHERE u.id = ?");
    $stmt->execute([$user_id]);
    $priv = $stmt->fetch(PDO::FETCH_ASSOC);
    return $priv && $priv['name'] === 'ADMIN';
} 

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>