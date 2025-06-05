<?php
session_start();
$error="";

if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST["login"])) {
     $id = $_POST['id'] ?? '';

    if(ctype_alnum($id)){
        $_SESSION['user_id']= $id;
        header ('Location: profile.php');
        die();
    } else {
        $error = "L'identifiant doit être alphanumérique";
    }
}

?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion</title>
</head>
<body>
    <h1>Se connecter </h1>
    
    <?php if ($error): ?>
        <p style="color: red;"><?php echo htmlspecialchars($error); ?></p>
    <?php endif; ?>
    
    <form method="POST" action="login.php">
        <div>
            <label for="id">Identifiant :</label>
            <input type="text" id="id" name="id" required>
        </div>
        <div>
            <input type="submit" value="Connexion" name="login">
        </div>
    </form>
</body>
</html>