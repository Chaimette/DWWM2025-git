<?php

require_once 'config.php';
if (!isUserAdmin($_SESSION['user_id'])) {
    header('Location: messages.php');
    exit();
}

$pdo = getDbConnection();
$users = $pdo->query("SELECT id, username, email FROM users")->fetchAll(PDO::FETCH_ASSOC);

$categories = $pdo->query("SELECT id, name FROM category")->fetchAll(PDO::FETCH_ASSOC);

$where = '';
$params = [];
if (isset($_GET['category']) && $_GET['category'] !== '') {
    $where = 'WHERE m.id_category = ?';
    $params[] = (int)$_GET['category'];
}

$messages = $pdo->prepare("
    SELECT m.id, m.title, m.content, m.created_at, m.updated_at, m.user_id, u.username, c.name AS category_name
    FROM messages m
    LEFT JOIN users u ON m.user_id = u.id
    LEFT JOIN category c ON m.id_category = c.id
    $where
    ORDER BY m.created_at DESC
");
$messages->execute($params);
$messages = $messages->fetchAll(PDO::FETCH_ASSOC);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['admin_delete_message'])) {
    $delete_id = (int)$_POST['delete_id'];
    $stmt = $pdo->prepare("UPDATE messages SET content = ?, title = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([
        "Ce message a été supprimé par un administrateur car il ne respectait pas nos règles.",
        "[Message supprimé]",
        $delete_id
    ]);
    $_SESSION['success_message'] = 'Message supprimé par un administrateur.';
    header("Location: adminPanel.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_user'])) {
    $delete_id = (int)$_POST['delete_id'];
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$delete_id]);
    header("Location: adminPanel.php");
    exit;
}
?>

<h1>Admin Panel</h1>

<?php if (!empty($_SESSION['success_message'])): ?>
    <div class="success"><?php echo htmlspecialchars($_SESSION['success_message']); unset($_SESSION['success_message']); ?></div>
<?php endif; ?>

<form method="GET" style="margin-bottom:20px;">
    <label for="category">Filtrer par catégorie :</label>
    <select name="category" id="category" onchange="this.form.submit()">
        <option value="">Toutes</option>
        <?php foreach ($categories as $cat): ?>
            <option value="<?= $cat['id'] ?>" <?= (isset($_GET['category']) && $_GET['category'] == $cat['id']) ? 'selected' : '' ?>>
                <?= htmlspecialchars($cat['name']) ?>
            </option>
        <?php endforeach; ?>
    </select>
</form>

<h2>Utilisateurs</h2>
<table border="1">
    <tr><th>Username</th><th>Email</th><th>Action</th></tr>
    <?php foreach ($users as $user): ?>
        <tr>
            <td><?= htmlspecialchars($user['username']) ?></td>
            <td><?= htmlspecialchars($user['email']) ?></td>
            <td>
                <form method="POST" style="display:inline;">
                    <input type="hidden" name="delete_id" value="<?= $user['id'] ?>">
                    <button type="submit" name="delete_user" onclick="return confirm('Supprimer cet utilisateur ?');">Supprimer</button>
                </form>
            </td>
        </tr>
    <?php endforeach; ?>
</table>

<h2>Messages</h2>
<table border="1">
    <tr>
        <th>Titre</th>
        <th>Contenu</th>
        <th>Auteur</th>
        <th>Catégorie</th>
        <th>Date</th>
        <th>Action</th>
    </tr>
    <?php foreach ($messages as $msg): ?>
        <tr>
            <td><?= htmlspecialchars($msg['title']) ?></td>
            <td><?= nl2br(htmlspecialchars($msg['content'])) ?></td>
            <td><?= htmlspecialchars($msg['username']) ?></td>
            <td><?= htmlspecialchars($msg['category_name']) ?></td>
            <td><?= htmlspecialchars($msg['created_at']) ?></td>
            <td>
                <form method="POST" style="display:inline;">
                    <input type="hidden" name="delete_id" value="<?= $msg['id'] ?>">
                    <button type="submit" name="admin_delete_message" onclick="return confirm('Supprimer ce message ?');">Supprimer</button>
                </form>
            </td>
        </tr>
    <?php endforeach; ?>
</table>