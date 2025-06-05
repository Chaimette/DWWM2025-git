<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

$user_id = $_SESSION['user_id'];
$message = $error = $target_file = $target_name = $mime_type = $oldName = "";
$users_data = [];
$target_dir = "./uploads/";


if (!is_dir("uploads")) {
    mkdir("uploads", true);
}

if (file_exists('users.json')) {
    $json_content = file_get_contents('users.json');
    $users_data = json_decode($json_content, true) ?? [];
}


$current_user = $users_data[$user_id] ?? ['prenom' => '', 'bio' => '', 'photo' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $prenom = htmlspecialchars($_POST['prenom']);
    $bio = htmlspecialchars($_POST['bio']);


    if (empty($prenom)) {
        $error = 'Le prénom est obligatoire.';
    } else {
        $photo_path = $current_user['photo'];
        $types_permis = ["image/png", "image/jpeg", "image/gif"];


        if (isset($_FILES['photo']) && !empty($_FILES['photo']['name'])) {
            if (!is_uploaded_file($_FILES["photo"]["tmp_name"])) {
                $error = 'Veuillez sélectionner un fichier valide.';
            } else {
                $oldName = basename($_FILES["photo"]["name"]);

                $target_name = uniqid(time() . "-", true) . "-" . $user_id . "-" . $oldName;

                $target_file = $target_dir . $target_name;

                $mime_type = mime_content_type($_FILES["photo"]["tmp_name"]);

                if (file_exists($target_file)) {
                    $error = "Ce fichier existe déjà";
                } elseif ($_FILES["photo"]["size"] > 2000000) {
                    $error = "Fichier trop volumineux (max 2Mo)";
                } elseif (!in_array($mime_type, $types_permis)) {
                    $error = "Type de fichier interdit. Seuls PNG, JPEG et GIF sont autorisés.";
                }

                if (empty($error)) {
                    if (move_uploaded_file($_FILES["photo"]["tmp_name"], $target_file)) {
                        $photo_path = $target_file;
                    } else {
                        $error = "Erreur lors du téléversement";
                    }
                }
            }
        }
        if (empty($error)) {
            $users_data[$user_id] = [
                'prenom' => $prenom,
                'bio' => $bio,
                'photo' => $photo_path
            ];

            if (file_put_contents('users.json', json_encode($users_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
                $message = 'Profil mis à jour avec succès !';
                $current_user = $users_data[$user_id];
            } else {
                $error = 'Erreur lors de la sauvegarde des données.';
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion de profil</title>
</head>

<body>
    <h1>Gestion de profil</h1>
    <p>Connecté en tant que : <strong><?php echo htmlspecialchars($user_id); ?></strong></p>

    <?php if ($message): ?>
        <p style="color: green;"><?php echo htmlspecialchars($message); ?></p>
    <?php endif; ?>

    <?php if ($error): ?>
        <p style="color: red;"><?php echo htmlspecialchars($error); ?></p>
    <?php endif; ?>

    <form method="POST" action="" enctype="multipart/form-data">
        <div>
            <label for="prenom">Prénom :</label><br>
            <input type="text" id="prenom" name="prenom" value="<?php echo htmlspecialchars($current_user['prenom']); ?>" required>
        </div>
        <br>

        <div>
            <label for="bio">Bio :</label><br>
            <textarea id="bio" name="bio" rows="5" cols="50"><?php echo htmlspecialchars($current_user['bio']); ?></textarea>
        </div>
        <br>

        <div>
            <label for="photo">Photo de profil :</label><br>
            <input type="file" id="photo" name="photo" accept="image/*">
            <small>Max 2Mo - Formats acceptés: JPEG, PNG, GIF</small>
            <?php if (!empty($current_user['photo']) && file_exists($current_user['photo'])): ?>
                <br><br>
                <strong>Photo actuelle :</strong><br>
                <img src="<?php echo htmlspecialchars($current_user['photo']); ?>" alt="Photo de profil" style="max-width: 150px; max-height: 150px;">
            <?php endif; ?>
        </div>
        <br>

        <div>
            <input type="submit" value="Mettre à jour le profil">
        </div>
    </form>

    <br>
    <a href="logout.php">Se déconnecter</a>
</body>

</html>