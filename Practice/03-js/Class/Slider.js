export default class Slider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentSlide = 0;
    this.totalSlides = 0;
    this.imagePaths = [];
    this.options = {
      autoplaySpeed: 3000,
    };
    this.autoplayInterval = null;
    this.isPaused = false;
    this.elements = {
      sliderContainer: null,
      slider: null,
      indicators: null,
      prevButton: null,
      nextButton: null,
      slides: [],
      indicatorButtons: [],
    };
  }

  initSlider(imagePaths, autoplaySpeed = 3000) {
    this.imagePaths = imagePaths;
    this.options.autoplaySpeed = autoplaySpeed;
    this.totalSlides = imagePaths.length;
    this.createSlider();
  }

  createSlider() {
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

    this.imagePaths.forEach((path, index) => {
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

    this.elements.sliderContainer = sliderContainer;
    this.elements.slider = slider;
    this.elements.indicators = indicators;
    this.elements.prevButton = prevButton;
    this.elements.nextButton = nextButton;

    this.container.appendChild(sliderContainer);

    this.addEventListeners();
    this.goToSlide(this.currentSlide);
  }

  addEventListeners() {
    this.elements.prevButton.addEventListener("click", () => {
      this.goToSlide(this.currentSlide - 1);
      this.isPaused = false;
      this.startAutoplay();
    });

    this.elements.nextButton.addEventListener("click", () => {
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
  }

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
    this.elements.sliderContainer.dataset.currentSlide = this.currentSlide;
  }

  startSlider() {
    this.startAutoplay();
  }

  startAutoplay() {
    if (this.options.autoplaySpeed > 0 && !this.isPaused) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = setInterval(() => {
        this.goToSlide(this.currentSlide + 1);
      }, this.options.autoplaySpeed);
    }
  }
}
