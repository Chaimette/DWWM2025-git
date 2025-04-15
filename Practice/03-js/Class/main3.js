import Slider from "./Slider.js";

const slider1 = new Slider("slider-container-1");
const imagePaths1 = [
  "images/img1.jpg",
  "images/img2.jpg",
  "images/img3.jpg",
];
slider1.initSlider(imagePaths1, 3000);
slider1.startSlider();

const slider2 = new Slider("slider-container-2");
const imagePaths2 = [
  "images/img4.jpg",
  "images/img5.jpg",
  "images/nice.gif",
];
slider2.initSlider(imagePaths2, 5000);
slider2.startSlider();

const slider3 = new Slider("slider-container-3");
const imagePaths3 = [
  "images/img1.jpg",
  "images/img2.jpg",
  "images/img3.jpg",
];
slider3.initSlider(imagePaths3, 3000);
slider3.startSlider();