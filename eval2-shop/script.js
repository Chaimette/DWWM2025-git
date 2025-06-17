 let products = [];
let cart = [];
let categories = [];
let currentCategory = "all";

const productGrid = document.getElementById("productGrid");
const loading = document.getElementById("loading");
const categoryFilter = document.getElementById("categoryFilter");

const productModal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const productDetail = document.getElementById("productDetail");

const cartIcon = document.getElementById("cartIcon");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const searchInput = document.getElementById("searchInput");
const searchSuggestions = document.getElementById("searchSuggestions");

const menuToggle = document.getElementById("menuToggle");
const menuList = document.getElementById("menuList");
const notification = document.getElementById("notification");

 function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function showNotification(message, duration = 2000) {
  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, duration);
}

 // FONCTIONS DE GESTION DES PRODUITS
 async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Problème lors de la récupération des produits");
    }
    products = await response.json();

    categories = [...new Set(products.map((product) => product.category))];
    createCategoryFilter();

    displayProducts();
    categoryFilter.style.display = "flex";
  } catch (error) {
    console.error("Erreur lors du chargement des produits:", error);
    productGrid.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--color-taupe);">
        <h2>Erreur de chargement</h2>
        <p>Impossible de charger les produits. Veuillez réessayer ultérieurement.</p>
        <button onclick="fetchProducts()" style="margin-top: 20px; padding: 10px 20px; background-color: var(--color-brown); color: white; border: none; border-radius: 5px; cursor: pointer;">Réessayer</button>
      </div>
    `;
  } finally {
    loading.style.display = "none";
  }
}

function createCategoryFilter() {
  categoryFilter.innerHTML = "";

  const select = document.createElement("select");
  select.className = "category-select";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "Tous les produits";
  select.appendChild(allOption);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    if (category === currentCategory) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    currentCategory = select.value;
    displayProducts();
  });

  categoryFilter.appendChild(select);
}

function displayProducts() {
  productGrid.innerHTML = "";

  const filteredProducts =
    currentCategory === "all"
      ? products
      : products.filter((product) => product.category === currentCategory);

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `
      <div style="text-align: center; grid-column: 1 / -1; padding: 50px;">
        <p>Aucun produit trouvé dans cette catégorie.</p>
      </div>
    `;
    return;
  }

  filteredProducts.forEach((product, index) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.style.animationDelay = `${index * 0.1}s`;

    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" onerror="this.onerror=null; this.src='/api/placeholder/250/250';">
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-title">${product.title}</div>
        <div class="product-price">${product.price.toFixed(2)} €</div>
      </div>
    `;

    productCard.addEventListener("click", () => showProductDetails(product));
    productGrid.appendChild(productCard);
  });
}

function showProductDetails(product) {
  const rating = product.rating ? product.rating.rate : 0;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  let starsHTML = "";
  for (let i = 0; i < fullStars; i++) starsHTML += "★";
  if (halfStar) starsHTML += "½";
  for (let i = 0; i < emptyStars; i++) starsHTML += "☆";

  productDetail.innerHTML = `
    <div class="detail-image">
      <img src="${product.image}" alt="${product.title}" onerror="this.onerror=null; this.src='/api/placeholder/300/300';">
    </div>
    <div class="detail-info">
      <div class="detail-category">${product.category}</div>
      <h2 class="detail-title">${product.title}</h2>
      <p class="detail-description">${product.description}</p>
      <div class="detail-rating">
        <span class="stars">${starsHTML}</span>
        <span class="rating-count">${product.rating ? `(${product.rating.count} avis)` : ""}</span>
      </div>
      <div class="detail-price">${product.price.toFixed(2)} €</div>
      <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
    </div>
  `;

  const addToCartBtn = productDetail.querySelector(".add-to-cart");
  addToCartBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product);
    productModal.style.display = "none";
    document.body.style.overflow = "";
  });

  productModal.style.display = "block";
  document.body.style.overflow = "hidden";
}

 // FONCTIONS DE RECHERCHE
 function displaySuggestions(matchingProducts) {
  searchSuggestions.innerHTML = "";
  if (matchingProducts.length == 0) {
    searchSuggestions.style.border = "1px solid #ccc";
    searchSuggestions.innerHTML = `<p style="padding: 10px 10px">Aucun produit trouvé.</p>`;
    return;
  }

  searchSuggestions.style.border = "1px solid #ccc";
  matchingProducts.forEach((product) => {
    const suggestion = document.createElement("div");
    suggestion.textContent = product.title;
    suggestion.addEventListener("click", () => {
      showProductDetails(product);
      searchSuggestions.innerHTML = "";
      searchInput.value = "";
    });
    searchSuggestions.appendChild(suggestion);
  });
}

 // FONCTIONS DE GESTION DU PANIER
 function loadCart() {
  const savedCart = sessionStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartUI();
  }
}

function saveCart() {
  sessionStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
    showNotification(`Quantité de "${truncateText(product.title, 20)}" augmentée !`);
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    showNotification(`"${truncateText(product.title, 20)}" ajouté au panier !`);
  }

  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = itemCount;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <p>Votre panier est vide</p>
      </div>
    `;
  } else {
    cartItems.innerHTML = "";
    cart.forEach((item) => {
      const cartItemEl = document.createElement("div");
      cartItemEl.className = "cart-item";
      cartItemEl.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.title}" onerror="this.onerror=null; this.src='/api/placeholder/100/100';">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">${item.price.toFixed(2)} €</div>
          <div class="cart-quantity">
            <button class="decrease-qty" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="increase-qty" data-id="${item.id}">+</button>
          </div>
          <button class="remove-item" data-id="${item.id}">Supprimer</button>
        </div>
      `;
      cartItems.appendChild(cartItemEl);

      const decreaseBtn = cartItemEl.querySelector(".decrease-qty");
      const increaseBtn = cartItemEl.querySelector(".increase-qty");
      const removeBtn = cartItemEl.querySelector(".remove-item");

      decreaseBtn.addEventListener("click", () => {
        decreaseQuantity(item.id);
      });

      increaseBtn.addEventListener("click", () => {
        increaseQuantity(item.id);
      });

      removeBtn.addEventListener("click", () => {
        removeFromCart(item.id);
      });
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `${total.toFixed(2)} €`;
}

function increaseQuantity(id) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity += 1;
    saveCart();
    updateCartUI();
    showNotification(`Quantité augmentée !`);
  }
}

function decreaseQuantity(id) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      saveCart();
      updateCartUI();
      showNotification(`Quantité diminuée !`);
    } else {
      removeFromCart(id);
    }
  }
}

function removeFromCart(id) {
  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    const itemName = cart[itemIndex].title;
    cart.splice(itemIndex, 1);
    saveCart();
    updateCartUI();
    showNotification(`"${truncateText(itemName, 20)}" supprimé du panier !`);
  }
}

 // GESTIONNAIRES D'ÉVÉNEMENTS
 
// Menu mobile
menuToggle.addEventListener("click", () => {
  menuList.classList.toggle("show");
});

// Modal produit
closeModal.addEventListener("click", () => {
  productModal.style.display = "none";
  document.body.style.overflow = "";
});

// Panier
cartIcon.addEventListener("click", () => {
  cartModal.classList.add("active");
  document.body.style.overflow = "hidden";
});

closeCart.addEventListener("click", () => {
  cartModal.classList.add("closing");
  document.body.style.overflow = "";

  cartModal.addEventListener(
    "transitionend",
    () => {
      cartModal.classList.remove("active", "closing");
    },
    { once: true }
  );
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    showNotification("Votre panier est vide !", 3000);
    return;
  }

  cartModal.classList.remove("active");
  document.body.style.overflow = "";
  showNotification("Commande validée ! Merci pour votre achat.", 5000);

  cart = [];
  saveCart();
  updateCartUI();
});

// Recherche
searchInput.addEventListener("input", (e) => {
  const query = searchInput.value.trim().toLowerCase();

  if (query.length >= 3) {
    const matchingProducts = products.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
    displaySuggestions(matchingProducts);
  } else {
    searchSuggestions.innerHTML = "";
    searchSuggestions.style.border = "none";
  }
});

 
// Gestion des clics à l'extérieur des éléments
window.addEventListener("click", (e) => {
  // Fermeture du menu
  if (!menuList.contains(e.target) && e.target !== menuToggle) {
    menuList.classList.remove("show");
  }

  // Fermeture de la modale produit
  if (e.target === productModal) {
    productModal.style.display = "none";
    document.body.style.overflow = "";
  }

  // Fermeture des suggestions de recherche
  if (!searchSuggestions.contains(e.target) && e.target !== searchInput) {
    searchSuggestions.innerHTML = "";
    searchInput.value = "";
  }

  // Fermeture du panier
  if (
    cartModal.classList.contains("active") &&
    !cartModal.contains(e.target) &&
    e.target !== cartIcon
  ) {
    cartModal.classList.add("closing");
    document.body.style.overflow = "";
    cartModal.addEventListener(
      "transitionend",
      () => {
        cartModal.classList.remove("active", "closing");
      },
      { once: true }
    );
  }
});

// Gestion des touches clavier
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Fermeture de la modale produit
    if (productModal.style.display === "block") {
      productModal.style.display = "none";
      document.body.style.overflow = "";
    }
    // Fermeture du panier
    if (cartModal.classList.contains("active")) {
      cartModal.classList.add("closing");
      document.body.style.overflow = "";
      cartModal.addEventListener(
        "transitionend",
        () => {
          cartModal.classList.remove("active", "closing");
        },
        { once: true }
      );
    }
  }
});

 function init() {
  loadCart();
  fetchProducts();
}

init();