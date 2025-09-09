import { setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // read existing cart (array), append, then save
  const cart = JSON.parse(localStorage.getItem("so-cart") || "[]");
  cart.push(product);
  setLocalStorage("so-cart", cart);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// Attach listeners to all add-to-cart buttons.
// Ensure your buttons have data-id attributes and a class like "add-to-cart".
document.querySelectorAll(".add-to-cart").forEach((btn) =>
  btn.addEventListener("click", addToCartHandler)
);
