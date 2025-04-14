

const gameContainer = document.getElementById("gameContainer");
const guessInput = document.getElementById("guessInput");
const submitButton = document.getElementById("submitGuess");
const messageElement = document.getElementById("message");
const attemptsElement = document.getElementById("attempts");
const mysteryNumberElement = document.getElementById("mysteryNumber");
const restartButton = document.getElementById("restartButton");
const resultImageElement = document.getElementById("resultImage");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalMessage = document.getElementById("modalMessage");
const closeButton = document.querySelector(".close-button");

let targetNumber;
let attempts;

function initGame() {
  targetNumber = Math.floor(Math.random() *100) +1;
  console.log(targetNumber);
  attempts = 7;

  guessInput.value = "";
  messageElement.textContent = "";
  attemptsElement.textContent = `Essais restants : ${attempts}`;

  guessInput.disabled = false;
  submitButton.disabled = false;

  gameContainer.classList.remove("flipped");
  //   resultImageElement.style.display = "none";

  guessInput.focus();
}

function checkGuess() {
  const guess = parseInt(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > 100) {
    messageElement.textContent = "Veuillez entrer un nombre entre 1 et 100";
    return;
  }

  attempts--;
  attemptsElement.textContent = `Essais restants : ${attempts}`;
  if (guess === targetNumber) {
    messageElement.textContent = "Gagné !";
    messageElement.style.color = "green";
    endGame(true);
  } else if (attempts === 0) {
    messageElement.textContent = "Perdu ! :( ";
    messageElement.style.color = "red";
    endGame(false);
  } else if (guess < targetNumber && guess === 69) {
    messageElement.innerHTML = "Nice &#x1F60F; ! Mais c'est plus grand que 69!";
  } else if (guess > targetNumber && guess === 69) {
    messageElement.innerHTML = "Nice &#x1F60F; ! Mais c'est plus petit que 69!";
  } else if (guess < targetNumber) {
    messageElement.textContent = "C'est plus grand que " + guess + " !";
  } else {
    messageElement.textContent = "C'est plus petit que " + guess + " !";
  }

  guessInput.value = "";
  guessInput.focus();
}

function endGame(won) {
  guessInput.disabled = true;
  submitButton.disabled = true;
  const guess = parseInt(guessInput.value);
  //   if (guess === 69) {
  //     mysteryNumberElement.innerHTML = targetNumber + ", nice &#x1F60F;";
  //     resultImageElement.src = "nice.gif";
  //     resultImageElement.alt = "Nice!";
  //   } else if (won) {
  //     mysteryNumberElement.innerHTML = targetNumber + ", bravo!";
  //     resultImageElement.src = "win1.gif";
  //     resultImageElement.alt = "Victoire";
  //   } else {
  //     mysteryNumberElement.innerHTML = targetNumber + ", dommage!";
  //     resultImageElement.src = "lose1.gif";
  //     resultImageElement.alt = "Défaite";
  //   }

  //   resultImageElement.style.display = "block";

  if (guess === 69) {
    modalTitle.textContent = "Nice !";
    modalImage.src = "nice.gif";
    modalMessage.textContent = `Le nombre était bien ${targetNumber} !`;
  } else if (won) {
    modalTitle.textContent = "C'est gagné !";
    modalImage.src = "win1.gif";
    modalMessage.textContent = `Le nombre était bien ${targetNumber} !`;
  } else {
    modalTitle.textContent = "Perdu ! :( ";
    modalImage.src = "lose1.gif";
    modalMessage.textContent = `Le nombre était ${targetNumber}`;
  }

  modal.style.display = "block";
  gameContainer.classList.add("flipped");
}

function closeModal() {
  modal.style.display = "none";
}

guessInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkGuess();
  }
});

submitButton.addEventListener("click", checkGuess);
restartButton.addEventListener("click", initGame);
closeButton.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

initGame();
