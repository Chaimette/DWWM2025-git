"use strict";

const drawCanvas = document.querySelector("#draw-canvas");
const drawCtx = drawCanvas.getContext("2d");

const bgCanvas = document.querySelector("#bg-canvas");
const bgCtx = bgCanvas.getContext("2d");

const colorPicker = document.getElementById("color-picker");
const clearButton = document.getElementById("clear-button");
const undoButton = document.getElementById("undo-button");
const redoButton = document.getElementById("redo-button");
const saveButton = document.getElementById("save-button");
const sizeSlider = document.getElementById("size-slider");
const colorPickerBg = document.getElementById("color-picker-bg");

let undoStack = [];
let redoStack = [];
const MAX_HISTORY_LENGTH = 20;

let painting = false;
let hasChanges = false;

function resizeCanvas() {
    let tempDrawingData = null;
    if (drawCanvas.width > 0) {
      tempDrawingData = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
    }

  drawCanvas.width = window.innerWidth;
  drawCanvas.height = window.innerHeight;

  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;

  bgCtx.fillStyle = colorPickerBg.value;
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  if (tempDrawingData) {
    drawCtx.putImageData(tempDrawingData, 0, 0);
  }

  saveState();
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function startPosition(e) {
  painting = true;
  hasChanges = false;
  draw(e);
}

function endPosition() {
  if (painting && hasChanges) {
    painting = false;
    drawCtx.beginPath();
    saveState();
  }
  painting = false;
  drawCtx.beginPath();
}

function draw(e) {
  if (!painting) return;
  hasChanges = true;
  drawCtx.lineCap = "round";
  drawCtx.strokeStyle = colorPicker.value;
  drawCtx.lineWidth = sizeSlider.value;

  drawCtx.lineTo(e.offsetX, e.offsetY);
  drawCtx.stroke();
  drawCtx.beginPath();
  drawCtx.moveTo(e.offsetX, e.offsetY);
}
drawCanvas.addEventListener("mousedown", startPosition);
drawCanvas.addEventListener("mouseup", endPosition);
drawCanvas.addEventListener("mousemove", draw);
drawCanvas.addEventListener("mouseleave", endPosition);

clearButton.addEventListener("click", function () {
  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  saveState();
});

colorPickerBg.addEventListener("input", function () {
  bgCtx.fillStyle = colorPickerBg.value;
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
  console.log("Background color changed to:", colorPickerBg.value);
  saveState();
});

saveButton.addEventListener("click", function () {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = drawCanvas.width;
  tempCanvas.height = drawCanvas.height;
  const tempCtx = tempCanvas.getContext("2d");

  tempCtx.drawImage(bgCanvas, 0, 0);
  tempCtx.drawImage(drawCanvas, 0, 0);

  const dataURL = tempCanvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "mymasterpiece.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

function saveDrawing() {
  const combinedState = {
    bgColor: colorPickerBg.value,
    drawingData: drawCanvas.toDataURL(),
  };
  return JSON.stringify(combinedState);
}

function saveState() {
  const currentState = saveDrawing();
  undoStack.push(currentState);

  if (undoStack.length > MAX_HISTORY_LENGTH) {
    undoStack.shift();
  }
  redoStack = [];

  try {
    localStorage.setItem("currentDrawing", currentState);
  } catch (e) {
    console.warn("Cannot save drawing to localStorage:", e);
  }

  updateUndoRedoButtons();
}

function restoreState(state) {
  if (!state) return;

  try {
    const parsedState = JSON.parse(state);

    colorPickerBg.value = parsedState.bgColor;
    bgCtx.fillStyle = parsedState.bgColor;
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    const img = new Image();
    img.onload = function () {
      drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
      drawCtx.drawImage(img, 0, 0);
    };
    img.src = parsedState.drawingData;
  } catch (e) {
    console.warn("Error restoring state:", e);

    const img = new Image();
    img.onload = function () {
      drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
      drawCtx.drawImage(img, 0, 0);
    };
    img.src = state;
  }
}

function undo() {
  if (undoStack.length <= 1) return;

  redoStack.push(undoStack.pop());
  restoreState(undoStack[undoStack.length - 1]);
  updateUndoRedoButtons();
}

function redo() {
  if (redoStack.length === 0) return;

  const stateToRestore = redoStack.pop();
  undoStack.push(stateToRestore);
  restoreState(stateToRestore);
  updateUndoRedoButtons();
}

undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);

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
