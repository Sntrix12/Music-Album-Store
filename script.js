let cart = JSON.parse(localStorage.getItem("soundvault_cart")) || [];
let currentDiscount = 0;

function saveCart() {
    localStorage.setItem("soundvault_cart", JSON.stringify(cart));
}

function toggleCart() {
    let modal = document.getElementById("cart-modal");
    if (modal.style.display === "flex") {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }
}

function addToCart(name, price) {
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    alert('Item added to cart!');
}

// Change header background color on scroll
window.addEventListener('scroll', function() {
    let header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = '#f8f9fa';
        header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    } else {
        header.style.backgroundColor = 'white';
        header.style.boxShadow = 'none';
    }
});

function updateCartUI() {
    let cartItems = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");
    let cartBtn = document.querySelector(".cart-btn");
    
    // Clear the current list
    cartItems.innerHTML = "";
    
    let total = 0;
    let itemCount = 0;
    
    // Add all items in the cart
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        total += item.price * item.quantity;
        itemCount += item.quantity;
        
        let li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.marginBottom = "15px";
        
        let infoDiv = document.createElement("div");
        infoDiv.className = "cart-item-info";
        infoDiv.style.flex = "1";
        infoDiv.innerHTML = `<strong class="cart-item-name">${item.name}</strong><br><span class="cart-item-price">₹${item.price.toFixed(2)} each</span>`;
        
        let controlsDiv = document.createElement("div");
        controlsDiv.style.display = "flex";
        controlsDiv.style.alignItems = "center";
        controlsDiv.style.gap = "10px";
        
        let minusBtn = document.createElement("button");
        minusBtn.innerText = "-";
        minusBtn.style.padding = "2px 8px";
        minusBtn.style.cursor = "pointer";
        minusBtn.onclick = function() {
            if (cart[i].quantity > 1) {
                cart[i].quantity -= 1;
            } else {
                cart.splice(i, 1);
            }
            saveCart();
            updateCartUI();
        };
        
        let qtySpan = document.createElement("span");
        qtySpan.innerText = item.quantity;
        qtySpan.style.fontWeight = "bold";
        
        let plusBtn = document.createElement("button");
        plusBtn.innerText = "+";
        plusBtn.style.padding = "2px 8px";
        plusBtn.style.cursor = "pointer";
        plusBtn.onclick = function() {
            cart[i].quantity += 1;
            saveCart();
            updateCartUI();
        };
        
        let removeBtn = document.createElement("button");
        removeBtn.innerHTML = "&times;";
        removeBtn.className = "cart-remove-btn";
        removeBtn.style.marginLeft = "10px";
        removeBtn.onclick = function() {
            cart.splice(i, 1);
            saveCart();
            updateCartUI();
        };
        
        controlsDiv.appendChild(minusBtn);
        controlsDiv.appendChild(qtySpan);
        controlsDiv.appendChild(plusBtn);
        controlsDiv.appendChild(removeBtn);
        
        li.appendChild(infoDiv);
        li.appendChild(controlsDiv);
        cartItems.appendChild(li);
    }
    
    let cartSubtotalEl = document.getElementById("cart-subtotal");
    let cartDiscountEl = document.getElementById("cart-discount");
    let cartDeliveryEl = document.getElementById("cart-delivery");
    let cartTotalEl = document.getElementById("cart-total");
    
    if (cartSubtotalEl && cartDiscountEl && cartDeliveryEl && cartTotalEl) {
        cartSubtotalEl.textContent = total.toFixed(2);
        
        let discountAmount = total * currentDiscount;
        cartDiscountEl.textContent = discountAmount.toFixed(2);
        
        // Delivery fee: ₹200, Free if subtotal >= 5000 (and not empty)
        let deliveryFee = (total >= 5000 || total === 0) ? 0 : 200; 
        
        if (deliveryFee === 0 && total > 0) {
            cartDeliveryEl.innerHTML = "<span style='color: #10b981; font-weight: bold;'>Free</span>";
        } else {
            cartDeliveryEl.textContent = "₹" + deliveryFee;
        }
        
        let finalTotal = total - discountAmount + deliveryFee;
        cartTotalEl.textContent = finalTotal.toFixed(2);
    } else {
        // Fallback
        cartTotal.textContent = total.toFixed(2);
    }
    
    cartBtn.textContent = "Cart (" + itemCount + ")";
}

function applyDiscount() {
    let codeInput = document.getElementById("discount-code").value.trim().toLowerCase();
    let msg = document.getElementById("discount-message");
    if (codeInput === "d50") {
        currentDiscount = 0.2; // 20% discount
        msg.innerText = "Code 'd50' applied: 20% Off!";
        msg.style.color = "#10b981";
        msg.style.display = "block";
    } else {
        currentDiscount = 0;
        msg.innerText = "Invalid discount code.";
        msg.style.color = "#ef4444";
        msg.style.display = "block";
    }
    updateCartUI();
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        // Generate mock order details
        let orderId = "#SV-" + Math.floor(100000 + Math.random() * 900000);
        let d = new Date();
        d.setDate(d.getDate() + 5);
        let deliveryDate = d.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        
        // Show confirmation popup safely if HTML exists
        let confModal = document.getElementById("confirmation-modal");
        if (confModal) {
            document.getElementById("confirm-order-id").innerText = orderId;
            document.getElementById("confirm-date").innerText = deliveryDate;
            confModal.style.display = "flex";
        } else {
            alert("Order Confirmed! Order Number: " + orderId + "\nEstimated Delivery: " + deliveryDate);
        }

        cart = [];
        saveCart();
        
        // Reset discount code states
        currentDiscount = 0;
        let msg = document.getElementById("discount-message");
        if(msg) msg.style.display = "none";
        let input = document.getElementById("discount-code");
        if(input) input.value = "";
        
        updateCartUI();
        toggleCart();
    }
}

function closeConfirmation() {
    let confirmModal = document.getElementById("confirmation-modal");
    if (confirmModal) {
        confirmModal.style.display = "none";
    }
}

function toggleLocations() {
    let modal = document.getElementById("locations-modal");
    if (modal.style.display === "flex") {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }
}

function toggleAbout() {
    let modal = document.getElementById("about-modal");
    if (modal.style.display === "flex") {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }
}

function toggleContact() {
    let modal = document.getElementById("contact-modal");
    if (modal.style.display === "flex") {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }
}

window.onclick = function(event) {
    let cartModal = document.getElementById("cart-modal");
    let locModal = document.getElementById("locations-modal");
    let aboutModal = document.getElementById("about-modal");
    let contactModal = document.getElementById("contact-modal");
    let confirmModal = document.getElementById("confirmation-modal");
    
    if (event.target == cartModal) {
        cartModal.style.display = "none";
    }
    if (event.target == locModal) {
        locModal.style.display = "none";
    }
    if (event.target == aboutModal) {
        aboutModal.style.display = "none";
    }
    if (event.target == contactModal) {
        contactModal.style.display = "none";
    }
    if (confirmModal && event.target == confirmModal) {
        confirmModal.style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', updateCartUI);
