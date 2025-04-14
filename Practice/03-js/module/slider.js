export function create(imagePaths) {
  const sliderContainer = document.getElementById("slider-container");
  const slider = document.getElementById("slider");
  const indicators = document.getElementsByClassName("indicators")[0];

  //on crée les slides et indicateurs

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
  });

  // nmbr d'image et index sur balise dataset
  sliderContainer.dataset.totalSlides = imagePaths.length;
  sliderContainer.dataset.currentSlide = 0;

  return sliderContainer;
}

export default function start(options = { autoplaySpeed: 3000 }) {
  const sliderContainer = document.querySelector(".slider-container");
  if (!sliderContainer) return;

  const prevButton = sliderContainer.querySelector("#precedent");
  const nextButton = sliderContainer.querySelector("#suivant");
  const indicators = sliderContainer.querySelectorAll(".indicator");
  const slides = sliderContainer.querySelectorAll(".slide");

  let currentSlide = parseInt(sliderContainer.dataset.currentSlide);
  const totalSlides = parseInt(sliderContainer.dataset.totalSlides);
  let autoplayInterval = null;
  let isPaused = false;

  // change slide function
  
  function goToSlide(index) {
    // boucle sur l'index
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;

    slides.forEach((slide) => slide.classList.remove("active"));
    indicators.forEach((ind) => ind.classList.remove("active"));

    //on ajoute la classe active à la currentSlide et à l'indicateur
    slides[index].classList.add("active");
    indicators[index].classList.add("active");

    // Maj index
    currentSlide = index;
    sliderContainer.dataset.currentSlide = currentSlide;
  }

  //défilement automatique
  function startAutoplay() {
    if (options.autoplaySpeed > 0 && !isPaused) {
      clearInterval(autoplayInterval);
      autoplayInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, options.autoplaySpeed);
    }
  }

  // bouton préc
  prevButton.addEventListener("click", () => {
    goToSlide(currentSlide - 1);
    isPaused = false;
    startAutoplay();
  });

  // bouton suiv
  nextButton.addEventListener("click", () => {
    goToSlide(currentSlide + 1);
    isPaused = false;
    startAutoplay();
  });

  // clics sur les indicateurs
  indicators.forEach((indicator) => {
    indicator.addEventListener("click", () => {
      const index = parseInt(indicator.dataset.index);
      goToSlide(index);
      isPaused = true;
      clearInterval(autoplayInterval);
    });
  });

  goToSlide(currentSlide);
  startAutoplay();
}
