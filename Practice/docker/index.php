<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
    <h1 >Surprise Motherfucker</h1>
    <h2 >
        <?php 
        $randomNumber = rand(1, 100);
        echo "Your lucky number is: " . $randomNumber;
        
    ?> </h2>
</body>
</html>