<?php
$livres = [
    ["titre" => "Le Petit Prince", "auteur" => "Antoine de Saint-Exupéry"],
    ["titre" => "Lord of the Rings", "auteur" => "J.R.R. Tolkien"],
    ["titre" => "A Discovery of Witches", "auteur" => "Deborah Harkness"],
    ["titre" => "The Bible", "auteur" => "Chuck Norris"]
];
$error = [];

// Étape 2 : Si formulaire soumis, ajouter un nouveau livre
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST["add"])) {
    $titre = $_POST['titre'] ?? '';
    $auteur = $_POST['auteur'] ?? '';
    
    if((empty($_POST["titre"])) ||(empty($_POST["auteur"])) ) {
        $error["input"] = "Merci de remplir tous les champs";
    }
    else {
        $titre = trim($_POST["titre"]);
        $titre = stripslashes($titre);
        $titre = htmlspecialchars($titre);

        $auteur = trim($_POST["auteur"]);
        $auteur = stripslashes($auteur);
        $auteur = htmlspecialchars($auteur);
    }

    if (empty($error["input"])) {
        $livres[] = ["titre" => $titre, "auteur" => $auteur];
        // Réinitialiser les champs du formulaire
        $_POST['titre'] = '';
        $_POST['auteur'] = '';
    }



}

?>

<!-- Étape 3 : Formulaire HTML -->
 <h2>Ajouter un livre</h2>
<form method="POST">
    <input type="text" name="titre" placeholder="Titre du livre" >
    <input type="text" name="auteur" placeholder="Auteur" >
    <button type="submit" name="add">Ajouter</button>
    <span class="error"><?= $error["input"]??"" ?></span>
</form>

<!-- Étape 4 : Affichage des livres -->
<h2>Liste des livres :</h2>
<ul>
    <?php foreach ($livres as $livre): ?>
        <li><strong><?= $livre['titre'] ?></strong> — <?= $livre['auteur'] ?></li>
    <?php endforeach; ?>
</ul>
