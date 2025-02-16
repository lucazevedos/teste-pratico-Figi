import { loadProducts, products } from './products.js';
import { addToCart } from './addCart.js';
import { getCart } from './getCart.js';

// Display products
async function displayProducts() {
    const productList = document.getElementById('product-list'); 

    const skeleton = `<div class="skeleton-card skeleton">
            <div class="skeleton-img skeleton"></div>
            <div class="skeleton-text skeleton"></div>
            <div class="skeleton-text skeleton"></div>
            <div class="skeleton-button skeleton"></div>
        </div>`;

    productList.innerHTML = skeleton.repeat(9);

    await loadProducts(); 
    productList.innerHTML = ''; 

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
            <div class="product-image">
            <img src="${product.image}" alt="${product.title}" width="100">
            <button id="addToCart" data-product-id="${product.id}"> <img width="12px" src="./assets/images/icon-add-to-cart.svg" alt="Decrement Item Quantity">Add to Cart</button>
            </div>
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">${product.title}</h3>
            <p class="price">$ ${product.price.toFixed(2)}</p>
        `;
        productList.appendChild(productElement);
    });
    document.querySelectorAll('#addToCart').forEach(button => {
        button.addEventListener('click', event => {
            const productId = parseInt(event.target.getAttribute('data-product-id'));
            const selectedProduct = products.find(p => p.id === productId);
            if (selectedProduct) {
                addToCart(selectedProduct);
                displayCart();
            }
        });
    });
}

// Change button
function changeButton(item) {
    const buttons = document.querySelectorAll("#addToCart");
    buttons.forEach((button) => {
        if (item.id === parseInt(button.getAttribute("data-product-id"))) {
            button.classList.add("added");
            button.innerHTML = `
                <button class="button-minus" onclick="minusCart(${item.id})"><img width="12px" src="./assets/images/icon-decrement-quantity.svg" alt="Decrement Item Quantity"></button>
                <input class"quantity" type="number" value="${item.quantity}" min="1" max="100">
                <button class="button-plus" onclick="plusCart(${item.id})"><img width="12px" src="./assets/images/icon-increment-quantity.svg" alt="Increment Item Quantity"></button>
            `;
        }
    });
}
// Reset button
function resetButton(productId) {
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    if (button) {
        button.classList.remove("added");
        button.innerHTML = `
            <img width="12px" src="./assets/images/icon-add-to-cart.svg" alt="Add to Cart">
            Add to Cart
        `;
    }
}
// Check if cart is visible
function checkCartVisibility() {
    const cartSection = document.getElementById("cart");
    const goToCartButton = document.querySelector(".go-to-cart");
    if (!cartSection || !goToCartButton) return;
    const cartRect = cartSection.getBoundingClientRect();
    const isVisible = cartRect.top < window.innerHeight && cartRect.bottom > 0;
    if (isVisible) {
        goToCartButton.classList.add("hidden");
    } else {
        goToCartButton.classList.remove("hidden");
    }
}
// Display cart items
function displayCart() {
    const cart = getCart();
    const cartContainer = document.getElementById("cart-list");

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = `
        <img class="cart-empty-img" src="./assets/images/illustration-empty-cart.svg" alt="Empty cart" class="cart-empty js-cart-empty">
        <span class="text-empty" >Your add items will appear here</span>
        `;
        return;
    }

    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <div class="cart-item-wrapper">
            <h3>${item.title}</h3>
            <div class="cart-price-quantity">
            <span class="quantity" id="quantity-${index}">${item.quantity}x</span>
            <span class="unit-price">R$ ${item.price.toFixed(2)}</span>
            <span class="total-price">R$ ${(item.price*item.quantity).toFixed(2)}</span>
            </div>
            </div>
            <button class="icon-remove" onclick="removeFromCart(${item.id})"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
            </svg></button>
        `;
        cartContainer.appendChild(cartItem);   
    });
    document.querySelector('.total-price-value').textContent = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    document.querySelector('.cart-items-count').textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    cart.forEach(item => changeButton(item));
}
// Increase item quantity
window.plusCart = function(productId) {
    let cart = getCart();
    const existingProduct = cart.find(item => item.id === productId);
    existingProduct.quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}
// Decrease item quantity
window.minusCart =  function(productId) {
    let cart = getCart();
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    } else {
        removeFromCart(productId);
        resetButton(productId);
    }
}
// Remove item from cart
window.removeFromCart = function(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
};
// Load products and display them
document.addEventListener("DOMContentLoaded", async () => {
    await displayProducts(); 
    await displayCart();
});
// Open modal
document.querySelector(".js-checkout-button").addEventListener("click", () => {
    const cart = getCart();
    const modal = document.querySelector(".order-modal-content");
    modal.innerHTML = "";
    cart.forEach(item => {
        const orderItem = document.createElement("div");
        orderItem.classList.add("order-item");
        orderItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" width="100">
            <div class="order-item-wrapper">
            <h3>${item.title}</h3>
            <div class="cart-price-quantity">
            <span class="quantity">${item.quantity}x</span>
            <span class="unit-price">R$ ${item.price.toFixed(2)}</span>
            </div>
            </div>
            <span class="total-price">R$ ${(item.price*item.quantity).toFixed(2)}</span>
        `;
        document.querySelector(".order-total-price .total-price-value").textContent = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
        modal.appendChild(orderItem);
    });
    document.querySelector(".js-order-confirmation-modal").classList.add("is-visible");
    document.querySelector(".js-overlay").classList.add("is-visible");
});
// Close modal
document.querySelector(".js-overlay").addEventListener("click", () => {
    document.querySelector(".js-order-confirmation-modal").classList.remove("is-visible");
    document.querySelector(".js-overlay").classList.remove("is-visible");
});
// New order button
document.querySelector(".btn-new-order").addEventListener("click", () => {
    localStorage.removeItem("cart");
    location.reload();
    displayCart();
    document.querySelector(".js-order-confirmation-modal").classList.remove("is-visible");
    document.querySelector(".js-overlay").classList.remove("is-visible");
    document.top.scrollIntoView({ behavior: "smooth" });
});
// Go to cart button
window.addEventListener("scroll", checkCartVisibility);
document.querySelector(".go-to-cart").addEventListener("click", () => {
    document.getElementById("cart").scrollIntoView({ behavior: "smooth" });
});
// Back to top button
(() => {
    const backToTopBtn = document.querySelector(".js-back-to-top");
    backToTopBtn.style.display = "none";

    const toggleVisibility = () => {
        backToTopBtn.style.display = window.scrollY > 100 ? "block" : "none";
    };

    window.addEventListener("scroll", toggleVisibility);

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
})();

