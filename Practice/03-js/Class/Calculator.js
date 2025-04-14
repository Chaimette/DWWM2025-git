export default class Calculator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.shouldResetCurrentOperand = false;

    this.createCalculator();

    this.addEventListeners();
  }

  createCalculator() {
    this.container.innerHTML = `
        <div class="calculator">
          <div class="display">
            <div class="previous-operand"></div>
            <div class="current-operand">0</div>
          </div>
          <button class=" clear">AC</button>
          <button class="delete">DEL</button>
          <button class="toggle-sign">±</button>
          <button class="operation">÷</button>
          <button class="number">7</button>
          <button class="number">8</button>
          <button class="number">9</button>
          <button class="operation">×</button>
          <button class="number">4</button>
          <button class="number">5</button>
          <button class="number">6</button>
          <button class="operation sous">-</button>
          <button class="number">1</button>
          <button class="number">2</button>
          <button class="number">3</button>
          <button class="operation">+</button>
          <button class="number">0</button>
          <button class="decimal">.</button>
          <button class="span-two equals">=</button>
        </div>
      `;

    this.displayPreviousOperand =
      this.container.querySelector(".previous-operand");
    this.displayCurrentOperand =
      this.container.querySelector(".current-operand");
  }

  addEventListeners() {
    this.container
      .querySelector(".toggle-sign")
      .addEventListener("click", () => this.toggleSign());
    this.container.querySelectorAll(".number").forEach((button) => {
      button.addEventListener("click", () =>
        this.appendNumber(button.textContent)
      );
    });

    this.container.querySelector(".sous").addEventListener("click", (event) => {
      if (this.operation === undefined && this.currentOperand !== "0") {
        this.toggleNegative();
      } else {
        this.chooseOperation(event.target.textContent);
      }
    });
    this.container
      .querySelector(".decimal")
      .addEventListener("click", () => this.appendDecimal());

    this.container.querySelectorAll(".operation").forEach((button) => {
      button.addEventListener("click", () =>
        this.chooseOperation(button.textContent)
      );
    });

    this.container
      .querySelector(".equals")
      .addEventListener("click", () => this.compute());

    this.container
      .querySelector(".clear")
      .addEventListener("click", () => this.clear());

    this.container
      .querySelector(".delete")
      .addEventListener("click", () => this.delete());
  }

  formatNumber(number) {
    let stringNumber = number.toString();

    if (stringNumber.includes(",")) {
      stringNumber = stringNumber.replace(",", ".");
    }

    const parts = stringNumber.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1];

    let integerDisplay;
    if (integerPart === "-") {
      integerDisplay = "-";
    } else if (integerPart === "" || isNaN(parseFloat(integerPart))) {
      integerDisplay = "";
    } else {
      const numValue = parseFloat(integerPart);
      integerDisplay = numValue.toLocaleString("fr-FR", {
        maximumFractionDigits: 0,
      });
    }

    if (decimalPart != null) {
      return `${integerDisplay},${decimalPart}`;
    } else {
      return integerDisplay;
    }
  }
  updateDisplay() {
    this.displayCurrentOperand.textContent = this.formatNumber(
      this.currentOperand
    );

    if (this.operation != null) {
      this.displayPreviousOperand.textContent = `${this.formatNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.displayPreviousOperand.textContent = "";
    }
  }

  appendNumber(number) {
    if (this.shouldResetCurrentOperand) {
      this.currentOperand = "";
      this.shouldResetCurrentOperand = false;
    }

    if (this.currentOperand === "0" && number !== "0") {
      this.currentOperand = number;
    } else if (this.currentOperand !== "0") {
      this.currentOperand += number;
    }

    this.updateDisplay();
  }

  appendDecimal() {
    if (this.shouldResetCurrentOperand) {
      this.currentOperand = "0";
      this.shouldResetCurrentOperand = false;
    }

    if (!this.currentOperand.includes(",")) {
      this.currentOperand += ",";
    }

    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;

    if (this.previousOperand !== "") {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand.replace(",", ".");
    this.currentOperand = "0";
    this.updateDisplay();
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand.replace(",", "."));
    const current = parseFloat(this.currentOperand.replace(",", "."));

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "×":
        computation = prev * current;
        break;
      case "÷":
        if (current === 0) {
          this.currentOperand = "Erreur";
          this.operation = undefined;
          this.previousOperand = "";

          this.updateDisplay();
          this.shouldResetCurrentOperand = true;
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    if (Number.isInteger(computation)) {
      this.currentOperand = computation.toString();
    } else {
      this.currentOperand = parseFloat(computation.toFixed(10)).toString();
    }
    this.currentOperand = this.currentOperand.replace(".", ",");
    this.operation = undefined;
    this.previousOperand = "";
    this.shouldResetCurrentOperand = true;
    this.updateDisplay();
  }
  toggleSign() {
    if (this.currentOperand.startsWith("-")) {
      this.currentOperand = this.currentOperand.substring(1);
    } else {
      this.currentOperand = "-";
    }

    this.updateDisplay();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.updateDisplay();
  }

  delete() {
    if (
      this.currentOperand.length === 1 ||
      (this.currentOperand.length === 2 && this.currentOperand.includes("-"))
    ) {
      this.currentOperand = "0";
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }

    this.updateDisplay();
  }
}
