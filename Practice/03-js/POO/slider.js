const Slider = {
  currentSlide: 0,
  totalSlides: 0,
  imagePaths: [],
  options: {
    autoplaySpeed: 3000,
    },
  autoplayInterval: null,
  isPaused: false,
  elements: {
    container: null,
    slider: null,
    indicators: null,
    prevButton: null,
    nextButton: null,
    slides: [],
    indicatorButtons: [],
  },

  init(options = {}) {
    this.options = { ...this.options, ...options };
    this.startAutoplay();
  },

  goToSlide(index) {
    if (index >= this.totalSlides) index = 0;
    if (index < 0) index = this.totalSlides - 1;

    this.elements.slides.forEach((slide) => slide.classList.remove("active"));
    this.elements.indicatorButtons.forEach((ind) =>
      ind.classList.remove("active")
    );

    this.elements.slides[index].classList.add("active");
    this.elements.indicatorButtons[index].classList.add("active");

    this.currentSlide = index;
    this.elements.container.dataset.currentSlide = this.currentSlide;
  },

  startAutoplay() {
    if (this.options.autoplaySpeed > 0 && !this.isPaused) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = setInterval(() => {
        this.goToSlide(this.currentSlide + 1);
      }, this.options.autoplaySpeed);
    }
  },

  create(imagePaths = false) {
    this.imagePaths = imagePaths;
    this.totalSlides = imagePaths.length;
    this.currentSlide = 0;

    const sliderContainer = document.createElement("div");
    sliderContainer.className = "slider-container";
    sliderContainer.dataset.totalSlides = this.totalSlides;
    sliderContainer.dataset.currentSlide = this.currentSlide;

    const slider = document.createElement("div");
    slider.className = "slider";

    const sliderControls = document.createElement("div");
    sliderControls.className = "slider-controls";

    const prevButton = document.createElement("button");
    prevButton.id = "precedent";
    prevButton.className = "slider-button";
    prevButton.textContent = "❮";

    const indicators = document.createElement("div");
    indicators.className = "indicators";

    const nextButton = document.createElement("button");
    nextButton.id = "suivant";
    nextButton.className = "slider-button";
    nextButton.textContent = "❯";

    sliderControls.appendChild(prevButton);
    sliderControls.appendChild(indicators);
    sliderControls.appendChild(nextButton);

    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(sliderControls);

    imagePaths.forEach((path, index) => {
      const img = document.createElement("img");
      img.src = path;
      img.alt = `Slide ${index + 1}`;
      img.className = `slide ${index === 0 ? "active" : ""}`;
      img.dataset.index = index;
      slider.appendChild(img);

      const indicator = document.createElement("button");
      indicator.className = `indicator ${index === 0 ? "active" : ""}`;
      indicator.dataset.index = index;
      indicators.appendChild(indicator);

      this.elements.slides.push(img);
      this.elements.indicatorButtons.push(indicator);
    });

    this.elements.container = sliderContainer;
    this.elements.slider = slider;
    this.elements.indicators = indicators;
    this.elements.prevButton = prevButton;
    this.elements.nextButton = nextButton;

    prevButton.addEventListener("click", () => {
      this.goToSlide(this.currentSlide - 1);
      this.isPaused = false;
      this.startAutoplay();
    });

    nextButton.addEventListener("click", () => {
      this.goToSlide(this.currentSlide + 1);
      this.isPaused = false;
      this.startAutoplay();
    });

    this.elements.indicatorButtons.forEach((indicator) => {
      indicator.addEventListener("click", () => {
        const index = parseInt(indicator.dataset.index);
        this.goToSlide(index);
        this.isPaused = true;
        clearInterval(this.autoplayInterval);
      });
    });

    this.goToSlide(this.currentSlide);
    this.init();

    return sliderContainer;
  },
};

export default Slider;
