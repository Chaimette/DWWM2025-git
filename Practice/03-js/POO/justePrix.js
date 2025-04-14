const JustePrix = {
  targetNumber: null,
  attempts: null,
  elements: {
    gameContainer: null,
    guessInput: null,
    submitButton: null,
    messageElement: null,
    attemptsElement: null,
    cardBack: null,
    cardFront: null,
    restartButton: null,
    modal: null,
    modalTitle: null,
    modalImage: null,
    modalMessage: null,
    closeButton: null,
  },

  init() {
    this.initElements();
    this.addEventListeners();
    this.initGame();
  },

  create() {
    this.elements.gameContainer = document.createElement("div");
    this.elements.gameContainer.id = "gameContainer";
    this.elements.gameContainer.className = "game-container";

    const gameInterface = document.createElement("div");
    gameInterface.className = "game-interface";

    const title = document.createElement("h2");
    title.textContent = "Le Juste Prix !";

    const description = document.createElement("p");
    description.textContent = "Devinez le nombre entre 1 et 100 !";
    description.className = "description";


    this.elements.cardFront = document.createElement("div");
    this.elements.cardFront.className = "card card-front";
    this.elements.cardFront.appendChild(title);
    this.elements.cardFront.appendChild(description);
    this.elements.gameContainer.appendChild(this.elements.cardFront);

    this.elements.cardBack = document.createElement("div");
    this.elements.cardBack.className = "card card-back";
    this.elements.gameContainer.appendChild(this.elements.cardBack);

    this.elements.guessInput = document.createElement("input");
    this.elements.guessInput.type = "number";
    this.elements.guessInput.id = "guessInput";
    this.elements.guessInput.min = "1";
    this.elements.guessInput.max = "100";
    this.elements.guessInput.placeholder = "Entre 1 et 100";
    gameInterface.appendChild(this.elements.guessInput);

    this.elements.submitButton = document.createElement("button");
    this.elements.submitButton.id = "submitGuess";
    this.elements.submitButton.textContent = "Valider";
    gameInterface.appendChild(this.elements.submitButton);

    this.elements.messageElement = document.createElement("p");
    this.elements.messageElement.id = "message";
    gameInterface.appendChild(this.elements.messageElement);

    this.elements.attemptsElement = document.createElement("p");
    this.elements.attemptsElement.id = "attempts";
    gameInterface.appendChild(this.elements.attemptsElement);

    this.elements.restartButton = document.createElement("button");
    this.elements.restartButton.id = "restartButton";
    this.elements.restartButton.className = "restart-button";
    this.elements.restartButton.textContent = "Recommencer";
    gameInterface.appendChild(this.elements.restartButton);

    this.elements.gameContainer.appendChild(gameInterface);

    this.elements.modal = document.createElement("div");
    this.elements.modal.id = "modal";
    this.elements.modal.className = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    this.elements.closeButton = document.createElement("span");
    this.elements.closeButton.className = "close-button";
    this.elements.closeButton.innerHTML = "&times;";
    modalContent.appendChild(this.elements.closeButton);

    this.elements.modalTitle = document.createElement("h2");
    this.elements.modalTitle.id = "modalTitle";
    modalContent.appendChild(this.elements.modalTitle);

    this.elements.modalImage = document.createElement("img");
    this.elements.modalImage.id = "modalImage";
    this.elements.modalImage.alt = "Résultat du jeu";
    modalContent.appendChild(this.elements.modalImage);

    this.elements.modalMessage = document.createElement("p");
    this.elements.modalMessage.id = "modalMessage";
    modalContent.appendChild(this.elements.modalMessage);

    this.elements.modal.appendChild(modalContent);
    this.elements.gameContainer.appendChild(this.elements.modal);

    this.init();

    return this.elements.gameContainer;
  },

  initElements() {
  },

  addEventListeners() {
    this.elements.guessInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.checkGuess();
    });
    this.elements.submitButton.addEventListener("click", () =>
      this.checkGuess()
    );
    this.elements.restartButton.addEventListener("click", () =>
      this.initGame()
    );
    this.elements.closeButton.addEventListener("click", () =>
      this.closeModal()
    );

    window.addEventListener("click", (e) => {
      if (e.target === this.elements.modal) {
        this.closeModal();
      }
    });
  },

  initGame() {
    this.attempts = 7;
    this.elements.attemptsElement.textContent = `Essais restants: ${this.attempts}`;
    this.elements.guessInput.value = "";
    this.elements.messageElement.textContent = "";
    this.elements.modal.style.display = "none";

    this.targetNumber = Math.floor(Math.random() * 100) + 1;
    this.elements.cardBack.textContent = this.targetNumber;
    console.log(this.targetNumber);

    this.elements.gameContainer.classList.remove("flipped");

    this.elements.guessInput.disabled = false;
    this.elements.submitButton.disabled = false;
  },

  checkGuess() {
    const guess = parseInt(this.elements.guessInput.value);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      this.elements.messageElement.textContent =
        "Veuillez entrer un nombre entre 1 et 100";
      return;
    }

    this.attempts--;
    this.elements.attemptsElement.textContent = `Essais restants: ${this.attempts}`;

    if (guess === this.targetNumber) {
      this.elements.messageElement.textContent = "Bravo!";
      this.elements.messageElement.style.color = "green";
      this.endGame(true);
    } else if (this.attempts === 0) {
      this.elements.messageElement.textContent = "Perdu! :(";
      this.elements.messageElement.style.color = "red";
      this.endGame(false);
    } else if (guess < this.targetNumber && guess === 69) {
      this.elements.messageElement.innerHTML =
        "Nice &#x1F60F; ! Mais c'est plus grand que 69!";
    } else if (guess > this.targetNumber && guess === 69) {
      this.elements.messageElement.innerHTML =
        "Nice &#x1F60F; ! Mais c'est plus petit que 69!";
    } else if (guess < this.targetNumber) {
      this.elements.messageElement.textContent =
        "C'est plus grand que " + guess + " !";
    } else {
      this.elements.messageElement.textContent =
        "C'est plus petit que " + guess + " !";
    }

    this.elements.guessInput.value = "";
    this.elements.guessInput.focus();
  },

  endGame(won) {
    this.elements.guessInput.disabled = true;
    this.elements.submitButton.disabled = true;
    const guess = parseInt(this.elements.guessInput.value) || 0; 

    if (guess === 69) {
      this.elements.modalTitle.textContent = "Nice !";
      this.elements.modalImage.src = "/images/nice.gif";
      this.elements.modalMessage.textContent = `Le nombre était bien ${this.targetNumber} !`;
    } else if (won) {
      this.elements.modalTitle.textContent = "C'est gagné !";
      this.elements.modalImage.src = "/images/win1.gif";
      this.elements.modalMessage.textContent = `Le nombre était bien ${this.targetNumber} !`;
    } else {
      this.elements.modalTitle.textContent = "Perdu ! :(";
      this.elements.modalImage.src = "/images/lose1.gif";
      this.elements.modalMessage.textContent = `Le nombre était ${this.targetNumber}`;
    }

    this.elements.modal.style.display = "block";
    this.elements.gameContainer.classList.add("flipped");
  },

  closeModal() {
    this.elements.modal.style.display = "none";
  },
};

export default JustePrix;
