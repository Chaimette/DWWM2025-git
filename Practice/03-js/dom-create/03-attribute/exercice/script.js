/* 
    Exercice 1 :
    Changer la taille de chaque paragraphe du main.
    chaque paragraphe doit être plus gros que le précédent.
*/

/* 
    Exercice 2 :
    Faite apparaître la modale via une transition depuis la gauche.
*/

/* 
    Exercice 3 :
    Faite que la couleur de fond de la modale soit aléatoire à chaque rechargement de la page.
*/

// Exercice 1

const para = document.querySelectorAll("main p");
let currentSize = 16;

para.forEach(changeSize);
function changeSize(para){
    para.style.fontSize = `${currentSize}px`;
    currentSize += 5;
}

// Exercice 2
const modal = document.getElementById("modal");
modal.style.top = "25vh";
modal.animate ( [
    {transform: 'translateX(0)'}, 
    {transform: 'translateX(125vw)'}
], {
    duration: 2000,
    iterations: 1,
    fill: "forwards"
})
;

/* const modal = document.getElementById("modal");
console.log(modal);
modal.style.transform = "translateX(125vw)"; */
// ne pas mettre (100%) dans le translate car correspond à la taille de l'élément, pas du viewport
// ! Lors de la déclaration d'une variable, js retourne le résultat du dernier élément utilisé.
// ! EXEMPLE: "const modal = document.getElementById("modal").animate" va retourner le résultat de animate, et non de getElementById


// Exercice 3

modal.style.backgroundColor = randomColor();
function randomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
} 