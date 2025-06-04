<?php
session_start();

$errors = [];
$users_file = "users.json";
$uploads_dir = "uploads/";

if (!file_exists($users_file)) {
    file_put_contents($users_file, json_encode([]));
}

if (!file_exists($uploads_dir)) {
    mkdir($uploads_dir);
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion et upload</title>
</head>
<body>
    <h1> Connexion et upload</h1>

    <?php if (!isset($_SESSION['user'])): ?>
    <h2>Connexion</h2>
    <form method="post">
        <input type="text" name="login_username" placeholder="Nom d'utilisateur" required>
        <input type="password" name="login_password" placeholder="Mot de passe" required>
        <button type="submit" name="login">Se connecter</button>
    </form>

    <h2>Inscription</h2>
    <form method="post">
        <input type="text" name="register_username" placeholder="Nom d'utilisateur" required>
        <input type="password" name="register_password" placeholder="Mot de passe" required>
        <button type="submit" name="register">S'inscrire</button>
    </form>
<?php else: ?>
    <h2>Bienvenue, <?= htmlspecialchars($_SESSION['user']) ?> !</h2>

    <form method="post" enctype="multipart/form-data">
        <input type="file" name="fichier" required>
        <button type="submit" name="upload">Uploader le fichier</button>
    </form>

    <form method="post">
        <button type="submit" name="logout">Se déconnecter</button>
    </form>

    <h3>Fichiers uploadés :</h3>
    <ul>
        <?php
        foreach (scandir($uploads_dir) as $file) {
            if ($file !== '.' && $file !== '..') {
                echo "<li><a href='$uploads_dir$file' target='_blank'>$file</a></li>";
            }
        }
        ?>
    </ul>
<?php endif; ?>
</body>
</html>