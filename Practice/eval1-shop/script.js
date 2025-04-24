"use strict";
// first, selectors
const productsContainer = document.getElementById("products-container");
const productModal = document.getElementById("product-modal");
const modalClose = document.getElementById("modal-close");
const productDetail = document.getElementById("product-detail");
const cartIcon = document.getElementById("cart-icon");
const cartPanel = document.getElementById("cart-panel");
const cartClose = document.getElementById("cart-close");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const cartCheckout = document.getElementById("cart-checkout");
const categoryFilter = document.getElementById("category-filter");
const sortBy = document.getElementById("sort-by");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const notification = document.getElementById("notification");

//api pour fetcher les produits, pas la vache
function fetchProducts() {
  productsContainer.innerHTML = '<div class="loader"></div>';

  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      displayProducts(products);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      showNotification("Erreur lors du chargement des produits.", "error");
      productsContainer.innerHTML =
        "<p>Erreur lors du chargement des produits. Veuillez réessayer.</p>";
    });
}
