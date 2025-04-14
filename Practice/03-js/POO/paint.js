const Paint = {
  isDrawing: false,
  currentColor: "#000000",
  brushSize: 5,
  ctx: null,
  elements: {
    container: null,
    canvas: null,
    colorPicker: null,
    brushSizeInput: null,
    clearButton: null,
  },

  init() {
    this.ctx = this.elements.canvas.getContext("2d");

    this.resizeCanvas();
    this.clearCanvas();

    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.brushSize;
  },

  resizeCanvas() {
    if (!this.elements.canvas || !this.elements.container) return;

    const rect = this.elements.container.getBoundingClientRect();
    this.elements.canvas.width = rect.width;
    this.elements.canvas.height = rect.height - 100;

    if (this.ctx) {
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.brushSize;
    }
  },

  clearCanvas() {
    if (!this.ctx || !this.elements.canvas) return;
    this.ctx.clearRect(
      0,
      0,
      this.elements.canvas.width,
      this.elements.canvas.height
    );
  },

  startDrawing(x, y) {
    if (!this.ctx) return;

    this.isDrawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  },

  draw(x, y) {
    if (!this.isDrawing || !this.ctx) return;

    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  },

  stopDrawing() {
    this.isDrawing = false;
  },

  updateColor(color) {
    this.currentColor = color;
    if (this.ctx) {
      this.ctx.strokeStyle = color;
    }
  },

  updateBrushSize(size) {
    this.brushSize = size;
    if (this.ctx) {
      this.ctx.lineWidth = size;
    }
  },

  create() {
    const paintContainer = document.createElement("div");
    paintContainer.className = "paint-container";

    const titleElement = document.createElement("h2");
    titleElement.textContent = "Paint";

    const canvas = document.createElement("canvas");
    canvas.className = "paint-canvas";

    const controlsContainer = document.createElement("div");
    controlsContainer.className = "paint-controls";

    const colorPickerLabel = document.createElement("label");
    colorPickerLabel.textContent = "Couleur: ";

    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = this.currentColor;

    const brushSizeLabel = document.createElement("label");
    brushSizeLabel.textContent = "Taille: ";

    const brushSizeInput = document.createElement("input");
    brushSizeInput.type = "range";
    brushSizeInput.min = "1";
    brushSizeInput.max = "50";
    brushSizeInput.value = this.brushSize;

    const clearButton = document.createElement("button");
    clearButton.textContent = "Effacer";

    colorPickerLabel.appendChild(colorPicker);
    brushSizeLabel.appendChild(brushSizeInput);

    controlsContainer.appendChild(colorPickerLabel);
    controlsContainer.appendChild(brushSizeLabel);
    controlsContainer.appendChild(clearButton);

    paintContainer.appendChild(titleElement);
    paintContainer.appendChild(canvas);
    paintContainer.appendChild(controlsContainer);

    this.elements.container = paintContainer;
    this.elements.canvas = canvas;
    this.elements.colorPicker = colorPicker;
    this.elements.brushSizeInput = brushSizeInput;
    this.elements.clearButton = clearButton;

    window.addEventListener("resize", () => this.resizeCanvas());

    canvas.addEventListener("mousedown", (e) => {
      this.startDrawing(e.offsetX, e.offsetY);
    });
  
    canvas.addEventListener("mousemove", (e) => {
      if (!this.isDrawing) return;
      this.draw(e.offsetX, e.offsetY);
    });

    canvas.addEventListener("mouseup", () => this.stopDrawing());
    canvas.addEventListener("mouseleave", () => this.stopDrawing());

    colorPicker.addEventListener("input", (e) =>
      this.updateColor(e.target.value)
    );
    brushSizeInput.addEventListener("input", (e) =>
      this.updateBrushSize(parseInt(e.target.value))
    );
    clearButton.addEventListener("click", () => this.clearCanvas());

    setTimeout(() => this.init(), 0);

    return paintContainer;
  },
};

export default Paint;
