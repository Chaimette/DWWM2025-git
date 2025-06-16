<?php
require_once 'config.php';

if (!isset($_SESSION['user_id']) || !isUserAdmin($_SESSION['user_id'])) {
    header('Location: messages.php');
    exit();
}

$error_message = '';
$success_message = '';

if (isset($_SESSION['success_message'])) {
    $success_message = $_SESSION['success_message'];
    unset($_SESSION['success_message']);
}

try {
    $pdo = getDbConnection();

    // ========== soft delete ==========
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['admin_delete_message'])) {
        $delete_id = (int)$_POST['delete_id'];

        $stmt = $pdo->prepare("UPDATE messages SET content = ?, title = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([
            "Ce message a été supprimé par un administrateur car il ne respectait pas nos règles.",
            "[Message supprimé]",
            $delete_id
        ]);

        $_SESSION['success_message'] = 'Message supprimé par un administrateur.';
        header("Location: adminPanel.php" . (isset($_GET['category']) ? '?category=' . $_GET['category'] : ''));
        exit();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_user'])) {
        $delete_id = (int)$_POST['delete_id'];

        // pour empecher la suppression de son propre compte
        if ($delete_id === $_SESSION['user_id']) {
            $error_message = 'Vous ne pouvez pas supprimer votre propre compte.';
        } else {
            try {
                $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
                $stmt->execute([$delete_id]);
                $_SESSION['success_message'] = 'Utilisateur supprimé avec succès.';
                header("Location: adminPanel.php");
                exit();
            } catch (PDOException $e) {
                $error_message = 'Erreur lors de la suppression de l\'utilisateur.';
            }
        }
    }

    $categories = [];
    try {
        $stmt = $pdo->query("SELECT id, name FROM category ORDER BY name");
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        $error_message = 'Erreur lors de la récupération des catégories.';
    }
    // Récupération des users avec stats
    $users_query = "
        SELECT u.id, u.username, u.email, u.created_at, p.name as privilege_name,
               COUNT(m.id) as message_count
        FROM users u 
        LEFT JOIN privilege p ON u.id_privilege = p.id
        LEFT JOIN messages m ON u.id = m.user_id
        GROUP BY u.id, u.username, u.email, u.created_at, p.name
        ORDER BY u.username
    ";
    $users = $pdo->query($users_query)->fetchAll(PDO::FETCH_ASSOC);

    // Récupération des catégories
    $categories = $pdo->query("SELECT id, name FROM category ORDER BY name")->fetchAll(PDO::FETCH_ASSOC);

    // Construction de la requête des messages w/ filtres
    $where = '';
    $params = [];
    if (isset($_GET['category']) && $_GET['category'] !== '') {
        $where = 'WHERE m.id_category = ?';
        $params[] = (int)$_GET['category'];
    }

    $messages_query = "
        SELECT m.id, m.title, m.content, m.created_at, m.updated_at, m.user_id, 
               u.username, c.name AS category_name
        FROM messages m
        LEFT JOIN users u ON m.user_id = u.id
        LEFT JOIN category c ON m.id_category = c.id
        $where
        ORDER BY m.created_at DESC
        LIMIT 100
    ";

    $stmt = $pdo->prepare($messages_query);
    $stmt->execute($params);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Statistiques générales
    $stats = $pdo->query("
        SELECT 
            (SELECT COUNT(*) FROM users) as total_users,
            (SELECT COUNT(*) FROM messages) as total_messages,
            (SELECT COUNT(*) FROM category) as total_categories,
            (SELECT COUNT(*) FROM messages WHERE DATE(created_at) = CURDATE()) as messages_today
    ")->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $error_message = 'Erreur lors de la récupération des données : ' . $e->getMessage();
    $users = [];
    $messages = [];
    $categories = [];
    $stats = ['total_users' => 0, 'total_messages' => 0, 'total_categories' => 0, 'messages_today' => 0];
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel d'Administration</title>
    <link rel="stylesheet" href="./css/adminPanel.css">
</head>

<body>
    <div class="header">
        <div class="container">
            <h1>🛡️ Panel Administrateur</h1>
            <div class="nav">
                <a href="messages.php">📝 Retour aux messages</a>
                <a href="logout.php">🚪 Déconnexion</a>
            </div>
        </div>
    </div>

    <div class="container">
        <?php if (!empty($success_message)): ?>
            <div class="alert alert-success">✅ <?php echo htmlspecialchars($success_message); ?></div>
        <?php endif; ?>

        <?php if (!empty($error_message)): ?>
            <div class="alert alert-error">❌ <?php echo htmlspecialchars($error_message); ?></div>
        <?php endif; ?>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['total_users']; ?></div>
                <div class="stat-label">Utilisateurs</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['total_messages']; ?></div>
                <div class="stat-label">Messages</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['total_categories']; ?></div>
                <div class="stat-label">Catégories</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['messages_today']; ?></div>
                <div class="stat-label">Messages aujourd'hui</div>
            </div>
        </div>

        <div class="section">
            <h2>👥 Gestion des Utilisateurs</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nom d'utilisateur</th>
                        <th>Email</th>
                        <th>Privilège</th>
                        <th>Messages</th>
                        <th>Inscription</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($users as $user): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($user['username']); ?></td>
                            <td><?php echo htmlspecialchars($user['email']); ?></td>
                            <td>
                                <span class="badge <?php echo $user['privilege_name'] === 'ADMIN' ? 'badge-admin' : 'badge-user'; ?>">
                                    <?php echo htmlspecialchars($user['privilege_name'] ?? 'USER'); ?>
                                </span>
                            </td>
                            <td><?php echo $user['message_count']; ?></td>
                            <td><?php echo date('d/m/Y', strtotime($user['created_at'])); ?></td>
                            <td>
                                <a href="messages.php?user_id=<?php echo $user['id']; ?>" class="btn btn-primary">
                                    📄 Voir messages
                                </a>
                                <?php if ($user['id'] !== $_SESSION['user_id']): ?>
                                    <form method="POST" style="display:inline;" onsubmit="return confirm('⚠️ Etes-vous sûr de vouloir supprimer cet utilisateur et tous ses messages ?');">
                                        <input type="hidden" name="delete_id" value="<?php echo $user['id']; ?>">
                                        <button type="submit" name="delete_user" class="btn btn-danger">
                                            🗑️ Supprimer
                                        </button>
                                    </form>
                                <?php else: ?>
                                    <span class="badge badge-admin">Vous</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>💬 Gestion des Messages</h2>

            <form method="GET" class="filter-form">
                <label for="category">🏷️ Filtrer par catégorie :</label>
                <select name="category" id="category" onchange="this.form.submit()">
                    <option value="">Toutes les catégories</option>
                    <?php foreach ($categories as $cat): ?>
                        <option value="<?php echo $cat['id']; ?>"
                            <?php echo (isset($_GET['category']) && $_GET['category'] == $cat['id']) ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($cat['name']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Contenu</th>
                        <th>Auteur</th>
                        <th>Catégorie</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($messages)): ?>
                        <tr>
                            <td colspan="6" style="text-align: center; color: #666; padding: 2rem;">
                                Aucun message trouvé
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($messages as $msg): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($msg['title']); ?></td>
                                <td class="content-preview"><?php echo htmlspecialchars($msg['content']); ?></td>
                                <td><?php echo htmlspecialchars($msg['username']); ?></td>
                                <td><?php echo htmlspecialchars($msg['category_name'] ?? 'Sans catégorie'); ?></td>
                                <td><?php echo date('d/m/Y H:i', strtotime($msg['created_at'])); ?></td>
                                <td>
                                    <form method="POST" style="display:inline;" onsubmit="return confirm('⚠️ Supprimer ce message ?');">
                                        <input type="hidden" name="delete_id" value="<?php echo $msg['id']; ?>">
                                        <button type="submit" name="admin_delete_message" class="btn btn-danger">
                                            🗑️ Supprimer
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>

</html>