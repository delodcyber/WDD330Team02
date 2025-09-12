
import { getLocalStorage, setLocalStorage,} from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  
  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = product.FinalPrice;
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}

// ************* Alternative Display Product Details Method *******************
// function productDetailsTemplate(product) {
//   return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
//     <h2 class="divider">${product.NameWithoutBrand}</h2>
//     <img
//       class="divider"
//       src="${product.Image}"
//       alt="${product.NameWithoutBrand}"
//     />
//     <p class="product-card__price">$${product.FinalPrice}</p>
//     <p class="product__color">${product.Colors[0].ColorName}</p>
//     <p class="product__description">
//     ${product.DescriptionHtmlSimple}
//     </p>
//     <div class="product-detail__add">
//       <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
//     </div></section>`;
// }











/* export default class ProductDetails {
  constructor(category = "tents", addButtonId = "addToCart", containerSelector = ".product-details") {
    this.dataSource = new ProductData(category);
    this.addButtonId = addButtonId;
    this.containerSelector = containerSelector;
    this.product = null;
  }

  // call after constructing the class to load product, render and attach listeners
  async init() {
    let id = getParam("id");
    if (id && /^\d+$/.test(id)) id = Number(id);

    try {
      this.product = await this.dataSource.findProductById(id);
    } catch (err) {
      console.error("ProductDetails.init: failed to load product data", err);
    }

    if (!this.product) {
      console.warn("ProductDetails.init: product not found for id", id);
      return;
    }

    this.renderProductDetails();

    const btn = document.getElementById(this.addButtonId);
    if (btn) {
      // ensure the button carries the id and use a bound handler so `this` is correct
      btn.dataset.id = this.product.Id;
      btn.addEventListener("click", this.addToCartHandler.bind(this));
    }
  }

  // adds the product object to localStorage under "so-cart" (always stores an array)
  addProductToCart(product) {
    let cart = getLocalStorage("so-cart");
    // normalize to an array if the stored value is not already one
    if (!Array.isArray(cart)) {
      cart = cart ? [cart] : [];
    }
    cart.push(product);
    setLocalStorage("so-cart", cart);
    return cart;
  }

  // handler used as event listener; will fetch product if needed then add to cart
  async addToCartHandler(e) {
    const id = e.currentTarget?.dataset?.id ?? e.target?.dataset?.id;
    if (!id) return;

    // ensure we have the product object
    if (!this.product || this.product.Id !== id) {
      const pid = /^\d+$/.test(id) ? Number(id) : id;
      this.product = await this.dataSource.findProductById(pid);
      if (!this.product) return;
    }

    this.addProductToCart(this.product);
  }

  // populate the DOM with the product details
  renderProductDetails() {
    const container = document.querySelector(this.containerSelector);
    if (!container || !this.product) return;

    const item = this.product;
    const html = `
      <div class="product-card">
        <img src="${item.Image}" alt="${item.Name}" class="product-card__image" />
        <h1 class="product-card__name">${item.Name}</h1>
        <p class="product-card__price">$${item.FinalPrice}</p>
        <p class="product-card__color">${item.Colors?.[0]?.ColorName ?? ""}</p>
        <p class="product-card__description">${item.Description ?? ""}</p>
      </div>
    `;

    container.innerHTML = html;
  }
}
```// filepath: c:\Users\PC\Documents\BYUI\WDD330\WDD330Team02\src\js\ProductDetails.mjs
import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

export default class ProductDetails {
  constructor(category = "tents", addButtonId = "addToCart", containerSelector = ".product-details") {
    this.dataSource = new ProductData(category);
    this.addButtonId = addButtonId;
    this.containerSelector = containerSelector;
    this.product = null;
  }

  // call after constructing the class to load product, render and attach listeners
  async init() {
    let id = getParam("id");
    if (id && /^\d+$/.test(id)) id = Number(id);

    try {
      this.product = await this.dataSource.findProductById(id);
    } catch (err) {
      console.error("ProductDetails.init: failed to load product data", err);
    }

    if (!this.product) {
      console.warn("ProductDetails.init: product not found for id", id);
      return;
    }

    this.renderProductDetails();

    const btn = document.getElementById(this.addButtonId);
    if (btn) {
      // ensure the button carries the id and use a bound handler so `this` is correct
      btn.dataset.id = this.product.Id;
      btn.addEventListener("click", this.addToCartHandler.bind(this));
    }
  }

  // adds the product object to localStorage under "so-cart" (always stores an array)
  addProductToCart(product) {
    let cart = getLocalStorage("so-cart");
    // normalize to an array if the stored value is not already one
    if (!Array.isArray(cart)) {
      cart = cart ? [cart] : [];
    }
    cart.push(product);
    setLocalStorage("so-cart", cart);
    return cart;
  }

  // handler used as event listener; will fetch product if needed then add to cart
  async addToCartHandler(e) {
    const id = e.currentTarget?.dataset?.id ?? e.target?.dataset?.id;
    if (!id) return;

    // ensure we have the product object
    if (!this.product || this.product.Id !== id) {
      const pid = /^\d+$/.test(id) ? Number(id) : id;
      this.product = await this.dataSource.findProductById(pid);
      if (!this.product) return;
    }

    this.addProductToCart(this.product);
  }

  // populate the DOM with the product details
  renderProductDetails() {
    const container = document.querySelector(this.containerSelector);
    if (!container || !this.product) return;

    const item = this.product;
    const html = `
      <div class="product-card">
        <img src="${item.Image}" alt="${item.Name}" class="product-card__image" />
        <h1 class="product-card__name">${item.Name}</h1>
        <p class="product-card__price">$${item.FinalPrice}</p>
        <p class="product-card__color">${item.Colors?.[0]?.ColorName ?? ""}</p>
        <p class="product-card__description">${item.Description ?? ""}</p>
      </div>
    `;

    container.innerHTML = html;
  }
}
  */