"use strict";

const images = [
  "./images/img1.jpg",
  "./images/img2.jpg",
  "./images/img3.jpg",
  "./images/img4.jpg",
  "./images/img5.jpg",
  "./images/img2.jpg",
];

async function addSlider() {
  const sliderJS = await import("./slider.js");
  const slider = sliderJS.create(images);
  document.body.append(slider);
  sliderJS.default({ autoplaySpeed: 3000 });
}

document.addEventListener("DOMContentLoaded", addSlider);
