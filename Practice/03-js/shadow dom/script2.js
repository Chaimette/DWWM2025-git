// Définition de l'élément personnalisé ProductCard
class ProductCard extends HTMLElement {
    constructor() {
      super();
      
      // Création du shadow DOM
      this.attachShadow({ mode: 'open' });
      
      // Récupération des attributs
      this.name = this.getAttribute('name') || 'Produit';
      this.description = this.getAttribute('description') || 'Description du produit';
      this.price = this.getAttribute('price') || '0.00';
      this.image = this.getAttribute('image') || 'https://via.placeholder.com/300x200';
      this.rating = this.getAttribute('rating') || 3;
      this.promotion = this.hasAttribute('promotion');
    }
    
    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }
    
    static get observedAttributes() {
      return ['name', 'description', 'price', 'image', 'rating', 'promotion'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this[name] = newValue;
        this.render();
      }
    }
    
    // Méthode pour générer les étoiles de notation
    generateStars(rating) {
      const starCount = 5;
      let starsHTML = '';
      
      for (let i = 1; i <= starCount; i++) {
        if (i <= rating) {
          starsHTML += '<span class="star filled">★</span>';
        } else {
          starsHTML += '<span class="star">☆</span>';
        }
      }
      
      return starsHTML;
    }
    
    // Rendu du composant
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            font-family: 'Arial', sans-serif;
          }
          
          .product-card {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            max-width: 300px;
            background-color: white;
            position: relative;
          }
          
          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          
          .product-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
          }
          
          .product-info {
            padding: 16px;
          }
          
          .product-name {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 8px 0;
            color: #333;
          }
          
          .product-description {
            font-size: 14px;
            color: #666;
            margin: 0 0 12px 0;
            line-height: 1.4;
          }
          
          .product-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }
          
          .product-price {
            font-size: 20px;
            font-weight: bold;
            color: #e63946;
          }
          
          .product-rating {
            display: flex;
          }
          
          .star {
            font-size: 18px;
            color: #ccc;
          }
          
          .star.filled {
            color: #ffc107;
          }
          
          .add-to-cart {
            background-color: #4caf50;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.2s;
          }
          
          .add-to-cart:hover {
            background-color: #388e3c;
          }
          
          .promotion-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #e63946;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            z-index: 2;
          }
        </style>
        
        <div class="product-card">
          ${this.promotion ? '<div class="promotion-badge">PROMO</div>' : ''}
          <img class="product-image" src="${this.image}" alt="${this.name}">
          <div class="product-info">
            <h3 class="product-name">${this.name}</h3>
            <p class="product-description">${this.description}</p>
            <div class="product-meta">
              <div class="product-price">${this.price}€</div>
              <div class="product-rating">
                ${this.generateStars(this.rating)}
              </div>
            </div>
            <button class="add-to-cart">Ajouter au panier</button>
          </div>
        </div>
      `;
    }
    
    // Configuration des écouteurs d'événements
    setupEventListeners() {
      const addToCartButton = this.shadowRoot.querySelector('.add-to-cart');
      
      addToCartButton.addEventListener('click', () => {
        // Création d'un événement personnalisé
        const addToCartEvent = new CustomEvent('add-to-cart', {
          bubbles: true,
          composed: true, // Pour traverser les limites du Shadow DOM
          detail: {
            name: this.name,
            price: this.price,
            image: this.image
          }
        });
        
        // Déclenchement de l'événement
        this.dispatchEvent(addToCartEvent);
      });
    }
  }
  
  // Enregistrement de l'élément personnalisé
  customElements.define('product-card', ProductCard);
  
  // Exemple d'utilisation
  document.addEventListener('DOMContentLoaded', () => {
    // Écouteur pour les événements add-to-cart
    document.addEventListener('add-to-cart', (event) => {
      console.log('Produit ajouté au panier:', event.detail);
      // Ici, vous pourriez implémenter la logique pour ajouter au panier
    });
    
    // Exemple de création et d'insertion d'un élément product-card
    const exampleCard = document.createElement('product-card');
    exampleCard.setAttribute('name', 'Sweat React');
    exampleCard.setAttribute('description', 'Sweat à capuche 100% coton');
    exampleCard.setAttribute('price', '39.99');
    exampleCard.setAttribute('image', 'https://picsum.photos/200/300');
    exampleCard.setAttribute('rating', '4');
    exampleCard.setAttribute('promotion', '');
    
    // Ajout de la carte au corps du document
    document.body.appendChild(exampleCard);
  });