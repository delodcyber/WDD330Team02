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
  // use currentTarget to get the dataset from the element that has the listener
  const id = e.currentTarget?.dataset?.id || e.target?.dataset?.id;
  if (!id) return; // no id -> nothing to do
  const product = await dataSource.findProductById(id);
  if (product) addProductToCart(product);
}

// Attach listeners to all add-to-cart buttons.
// Ensure your buttons have data-id attributes and a class like "add-to-cart".
document.querySelectorAll(".add-to-cart").forEach((btn) =>
  btn.addEventListener("click", addToCartHandler)
);
