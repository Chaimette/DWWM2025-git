<?php
require_once 'config.php';
require_once './service/_csrf.php';


if (isset($_SESSION['user_id'])) {
    header('Location: messages.php');
    exit();
}/* 
    Pour des raisons de simplicité du cours, on n'a pas mit de securité sur ce formulaire, 
    mais pensez à en ajouter sur vos projets.
    (csrf, captcha, confirmation du mail...)
*/
$username = $email = $password = "";
$id_privilege = 1;
$error = [];

if($_SERVER['REQUEST_METHOD']==='POST' && isset($_POST['inscription']))
{
    $pdo = getDbConnection();

    if(empty($_POST["username"]))
    {
        $error["username"] = "Veuillez saisir un nom d'utilisateur";
    }
    else
    {
        $username = cleanData($_POST["username"]);
        if(!preg_match("/^[a-zA-Z' -]{2,25}$/", $username))
        {
            $error["username"] = "Votre nom d'utilisateur ne doit contenir que des lettres. (entre 2 et 25)";
        }
    }// fin vérification username
    if(empty($_POST["email"]))
    {
        $error["email"] = "Veuillez saisir un email";
    }
    else
    {
        $email = cleanData($_POST["email"]);
       
        if(!filter_var($email, FILTER_VALIDATE_EMAIL))
        {
            $error["email"] = "Veuillez saisir une adresse email valide";
        }
        else
        {
            $sql = $pdo->prepare("SELECT * FROM users WHERE email=?");
            $sql->execute([$email]);
            $user = $sql->fetch();
            if($user)
            {
                $error["email"] = "Cet email est déjà utilisé";
            }
        }
    }// fin vérification email
    if(empty($_POST["password"]))
    {
        $error["password"] = "Veuillez saisir un mot de passe";
    }
    else
    {
        $password = trim($_POST["password"]);
        if(!preg_match("/^(?=.*[!?@#$%^&*+-])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{6,}$/", $password))
        {
            $error["password"] = "Veuillez utiliser au moins 6 minuscule, majuscule, chiffre et caractère speciaux";
        }
        else
        {
            // ! Je hash le mot de passe
            $password = password_hash($password, PASSWORD_DEFAULT);
        }
    
    if(empty($_POST["passwordBis"]))
    {
        $error["passwordBis"] = "Veuillez confirmer votre mot de passe";
    }
    elseif($_POST["password"] !== $_POST["passwordBis"])
    {
        $error["passwordBis"] = "Veuillez saisir le même mot de passe";
    }
    if(empty($error))
    {
        $sql = $pdo->prepare("INSERT INTO users(username, email, password, id_privilege ) VALUES(?, ?, ?, ?)");
        $sql->execute([$username, $email, $password, $id_privilege]);

        header("Location: messages.php");
        exit;
    }
}
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/login.css">
    <title>Inscription</title>
</head>
<body>
    

    <div class="container">
    <h1>Inscription</h1>
<form action="./register.php" method="post">
    <input type="text" name="username" id="username" placeholder="Votre nom d'utilisateur" required>
    <span class="erreur"><?php echo $error["username"]??""; ?></span>
    <br>
    <input type="email" name="email" id="email" placeholder="Adresse email" required>
    <span class="erreur"><?php echo $error["email"]??""; ?></span> 
    <br>
    <input type="password" name="password" id="password" placeholder="Votre mot de passe" required>
    <span class="erreur"><?php echo $error["password"]??""; ?></span> 
    <br>
    <input type="password" name="passwordBis" id="passwordBis" placeholder="Confirmer votre mot de passe" required>
    <span class="erreur"><?php echo $error["passwordBis"]??""; ?></span> 
    <br>
    <a href="login.php">Se connecter</a>

    <input type="submit" value="Inscription" name="inscription">
</form>
</div>
</body>
</html>