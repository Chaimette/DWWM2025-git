"use strict";
import JustePrix from "./justePrix.js";
import Slider from "./slider.js";
import Paint from "./paint.js";

const App = {
  currentApp: null,

  elements: {
    appSelector: null,
    appContainer: null,
  },

  imagePaths: [
    "images/img1.jpg",
    "images/img2.jpg",
    "images/img3.jpg",
    "images/nice.gif",
    "images/img4.jpg",
    "images/img5.jpg",
  ],

  init() {
    this.elements.appSelector = document.getElementById("appli");
    this.elements.appContainer = document.querySelector(".appli");

    this.elements.appSelector.addEventListener("change", () => {
      this.loadApp(this.elements.appSelector.value);
    });

    if (this.elements.appSelector.value) {
      this.loadApp(this.elements.appSelector.value);
    }
  },

  loadApp(appName) {
    this.currentApp = appName;

    this.elements.appContainer.innerHTML = "";

    switch (appName) {
        case 'justePrix':
          this.elements.appContainer.appendChild(JustePrix.create());
          break;
      case "paint":
        this.elements.appContainer.appendChild(Paint.create());
        break;
      case "slider":
        this.elements.appContainer.appendChild(Slider.create(this.imagePaths));
        break;
      default:
        this.elements.appContainer.innerHTML =
          "<p>Something went wrong, loser</p>";
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
