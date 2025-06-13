<?php
require_once 'config.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_message'])) {
    $title = trim($_POST['title']);
    $content = trim($_POST['content']);
    $id_category = isset($_POST['id_category']) ? (int)$_POST['id_category'] : null;


    if (!empty($title) && !empty($content) && !empty($id_category)) {
        try {
            $pdo = getDbConnection();
            $stmt = $pdo->prepare("INSERT INTO messages (user_id, id_category, title, content) VALUES (?, ?, ?)");
            $stmt->execute([$_SESSION['user_id'], $id_category, $title, $content]);
            // Session flash pour faire disparaitre message de conf
            $_SESSION['success_message'] = 'Message ajouté avec succès !';
            header("Location: /messages.php?success=1");
            die;
        } catch (PDOException $e) {
            $error_message = 'Erreur lors de l\'ajout du message.';
        }
    } else {
        $error_message = 'Veuillez remplir tous les champs.';
    }
}
$success_message = '';
if (isset($_GET['success']) && $_GET['success'] == 1 && isset($_SESSION['success_message'])) {
    $success_message = $_SESSION['success_message'];
    unset($_SESSION['success_message']);
}
try {
    $pdo = getDbConnection();

    //récup les infos du user
    $stmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user_info = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user_info) {
        header('Location: login.php');
        exit();
    }

    //récup les messages
    $stmt = $pdo->prepare("SELECT id, title, content, created_at, updated_at FROM messages WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $error_message = 'Erreur lors de la récupération des messages.';
    $messages = [];
}

// ------------ UPDATE -------------------------

$edit_message = null;
if (isset($_GET['edit'])) {
    $edit_id = (int)$_GET['edit'];
    foreach ($messages as $msg) {
        if ($msg['id'] == $edit_id) {
            $edit_message = $msg;
            break;
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_message'])) {
    $edit_id = (int)$_POST['edit_id'];
    $title = trim($_POST['title']);
    $content = trim($_POST['content']);

    if (!empty($title) && !empty($content)) {
        try {
            $pdo = getDbConnection();
            $stmt = $pdo->prepare("UPDATE messages SET title = ?, content = ?, updated_at = NOW() WHERE id = ? AND user_id = ?");
            $stmt->execute([$title, $content, $edit_id, $_SESSION['user_id']]);
            $_SESSION['success_message'] = 'Message modifié avec succès !';
            header("Location: /messages.php?success=1");
            exit;
        } catch (PDOException $e) {
            $error_message = 'Erreur lors de la modification du message.';
        }
    } else {
        $error_message = 'Veuillez remplir tous les champs.';
    }
}

// ------------- DELETE ---------------

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_message'])) {
    $delete_id = (int)$_POST['delete_id'];

    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare("DELETE FROM messages WHERE id = ? AND user_id = ?");
        $stmt->execute([$delete_id, $_SESSION['user_id']]);
        $_SESSION['success_message'] = 'Message supprimé avec succès !';
        header("Location: /messages.php?success=1");
        exit;
    } catch (PDOException $e) {
        $error_message = 'Erreur lors de la suppression du message.';
    }
}

// ------------------ CATEGORIES -------------------

$pdo = getDbConnection();
$categories = [];
try {
    $stmt = $pdo->query("SELECT id, name FROM category ORDER BY name");
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $error_message = 'Erreur lors de la récupération des catégories.';
}

?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Messages de <?php echo htmlspecialchars($user_info['username']); ?></title>
    <link rel="stylesheet" href="./css/messages.css">
</head>

<body>
    <div class="header">
        <h1>Messages de <?php echo htmlspecialchars($user_info['username']); ?></h1>
        <?php if (isUserAdmin($_SESSION['user_id'])): ?>
            <a href="adminPanel.php" class="admin-btn">Admin Panel</a>
        <?php endif; ?>
        <a href="logout.php" class="logout-btn">Déconnexion</a>
    </div>
    <?php if ($edit_message): ?>
        <div class="message-form">
            <h2>Modifier le message</h2>
            <form method="POST">
                <input type="hidden" name="edit_id" value="<?php echo $edit_message['id']; ?>">
                <input type="text" name="title" value="<?php echo htmlspecialchars($edit_message['title']); ?>" required>
                <textarea name="content" required><?php echo htmlspecialchars($edit_message['content']); ?></textarea>
                <button type="submit" name="update_message">Enregistrer les modifications</button>
                <a href="messages.php">Annuler</a>
            </form>
        </div>
    <?php endif; ?>

    <?php if ($user_id === $_SESSION['user_id']): ?>
        <?php if (!$edit_message): ?>

            <div class="message-form">
                <h2>Ajouter un nouveau message</h2>

                <?php if (isset($success_message)): ?>
                    <div class="success"><?php echo htmlspecialchars($success_message); ?></div>
                <?php endif; ?>

                <?php if (isset($error_message)): ?>
                    <div class="error"><?php echo htmlspecialchars($error_message); ?></div>
                <?php endif; ?>

                <form method="POST">
                    <input type="text" name="title" placeholder="Titre du message" required>
                    <select name="id_category" required>
                        <option value="">-- Choisir une catégorie --</option>
                        <?php foreach ($categories as $cat): ?>
                            <option value="<?php echo $cat['id']; ?>"><?php echo htmlspecialchars($cat['name']); ?></option>
                        <?php endforeach; ?>
                    </select>
                    <textarea name="content" placeholder="Contenu du message" required></textarea>
                    <button type="submit" name="add_message">Publier le message</button>
                </form>
            </div>
        <?php endif; ?>
    <?php endif; ?>

    <div class="messages-list">
        <h2>Liste des messages (<?php echo count($messages); ?>)</h2>

        <?php if (empty($messages)): ?>
            <div class="message-card no-messages">
                Aucun message trouvé pour cet utilisateur.
            </div>
        <?php else: ?>
            <?php foreach ($messages as $message): ?>
                <div class="message-card">
                    <div class="message-title"><?php echo htmlspecialchars($message['title']); ?></div>
                    <div class="message-content"><?php echo nl2br(htmlspecialchars($message['content'])); ?></div>
                    <div class="message-date">
                        Publié le <?php echo date('d/m/Y à H:i', strtotime($message['created_at']));
                                    if (isset($message['updated_at']) && $message['updated_at']): ?>
                            / Modifié le <?php echo date('d/m/Y à H:i', strtotime($message['updated_at'])); ?>
                        <?php endif; ?>

                    </div>

                    <div class="btn"> <a href="?edit=<?php echo $message['id']; ?>">Modifier le message</a>


                    </div>
                    <div class="btn">
                        <form method="POST" style="display:inline;">
                            <input type="hidden" name="delete_id" value="<?php echo $message['id']; ?>">
                            <button type="submit" name="delete_message" onclick="return confirm('Supprimer ce message ?');">Supprimer le message</button>
                        </form>

                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</body>

</html>