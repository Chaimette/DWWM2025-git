"usestrict";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("color-picker");
const clearButton = document.getElementById("clear-button");
const undoButton = document.getElementById("undo-button");
const redoButton = document.getElementById("redo-button");
const saveButton = document.getElementById("save-button");
const sizeSlider = document.getElementById("size-slider");
const colorPickerBg = document.getElementById("color-picker-bg");

let undoStack = [];
let redoStack = [];
const MAX_HISTORY_LENGTH = 10;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = colorPickerBg.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  saveState();
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let painting = false;
let hasChanges = false;
function startPosition(e) {
  painting = true;
  hasChanges = false;
  draw(e);
}

function endPosition() {
  if (painting && hasChanges) {
    painting = false;
    ctx.beginPath();
    saveState();
  }
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;
  hasChanges = true;
  ctx.lineCap = "round";
  ctx.strokeStyle = colorPicker.value;
  ctx.lineWidth = sizeSlider.value;

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

clearButton.addEventListener("click", function () {
  ctx.fillStyle = colorPickerBg.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  saveState();
});

colorPickerBg.addEventListener("input", function () {
  ctx.fillStyle = colorPickerBg.value;

  console.log("Background color changed to:", colorPickerBg.value);

  ctx.fillRect(0, 0, canvas.width, canvas.height);
  saveDrawing();

  saveState();
});

function saveDrawing() {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.drawImage(canvas, 0, 0);
  return tempCanvas.toDataURL();
}


saveButton.addEventListener("click", function () {
  const link = document.createElement("a");
  link.href = canvas.toDataURL();
  link.download = "painting.png";
  link.click();
});

function saveState() {
  redoStack = [];
  updateUndoRedoButtons();
  const state = canvas.toDataURL();

  undoStack.push(state);

  if (undoStack.length > MAX_HISTORY_LENGTH) {
    undoStack.shift();
  }

  try {
    localStorage.setItem("currentDrawing", state);
  } catch (e) {
    console.warn("Impossible de sauvegarder dans localStorage:", e);
  }

  updateUndoRedoButtons();
}

undoButton.addEventListener("click", undo);

function undo() {
  if (undoStack.length <= 1) return;

  redoStack.push(undoStack.pop());
  restoreState(undoStack[undoStack.length - 1]);
  updateUndoRedoButtons();
}

redoButton.addEventListener("click", redo);

function redo() {
  if (redoStack.length === 0) return;

  const stateToRestore = redoStack.pop();
  undoStack.push(stateToRestore);
  restoreState(stateToRestore);
  updateUndoRedoButtons();
}

function restoreState(state) {
  const img = new Image();
  img.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  img.src = state;
}

function updateUndoRedoButtons() {
  undoButton.disabled = undoStack.length <= 1;
  redoButton.disabled = redoStack.length === 0;
}

window.addEventListener("load", function () {
  try {
    const savedDrawing = localStorage.getItem("currentDrawing");
    if (savedDrawing) {
      restoreState(savedDrawing);
      undoStack = [savedDrawing];
    } else {
      saveState();
    }
  } catch (e) {
    console.warn("Impossible de charger le dessin sauvegardé:", e);
    saveState();
  }

  updateUndoRedoButtons();
});
