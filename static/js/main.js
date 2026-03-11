// static/js/main.js - COMPLETE FIXED VERSION

// ========== PRODUCTS DATA ==========
const products = [
    {id:1, name:"Formula 1 Shake", price:1200, image:"formula1.jpg", category:"protein", description:"High protein meal replacement shake."},
    {id:2, name:"Herbal Tea Concentrate", price:800, image:"herbaltea.jpg", category:"tea", description:"Boosts metabolism and energy."},
    {id:3, name:"Aloe Concentrate", price:900, image:"aloe.jpg", category:"wellness", description:"Supports digestion and detox."},
    {id:4, name:"Protein Powder", price:1500, image:"proteinpowder.jpg", category:"protein", description:"Extra protein for muscle recovery."},
    {id:5, name:"Afresh Energy Drink", price:700, image:"afresh.jpg", category:"tea", description:"Refreshing herbal energy drink."},
    {id:6, name:"Multivitamin Tablets", price:950, image:"multivitamin.jpg", category:"wellness", description:"Daily vitamins and minerals."},
    {id:7, name:"Protein Bars", price:600, image:"proteinbar.jpg", category:"protein", description:"Healthy protein snack."},
    {id:8, name:"Collagen Skin Booster", price:1600, image:"collagen.jpg", category:"wellness", description:"Improves skin health."},
    {id:9, name:"Fiber Supplement", price:850, image:"fiber.jpg", category:"wellness", description:"Supports digestive health."},
    {id:10, name:"Active Fiber Complex", price:900, image:"activefiber.jpg", category:"wellness", description:"Helps control hunger."}
];

// ========== CART ==========
let cart = [];

// Load cart from localStorage
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
}

// ========== CART TOGGLE FUNCTIONS ==========
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (!cartSidebar) return;
    
    cartSidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    
    // Prevent body scrolling when cart is open
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ========== DISPLAY PRODUCTS ==========
function displayProducts(productList) {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    if (productList.length === 0) {
        grid.innerHTML = "<p class='no-products'>No products found</p>";
        return;
    }

    grid.innerHTML = productList.map(product => `
        <div class="product-card">
            <img src="/static/images/${product.image}" 
                 alt="${product.name}" 
                 onerror="this.src='/static/images/default.jpg'">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">₹${product.price}</p>
            <button onclick="addToCart('${product.name}', ${product.price})" class="add-to-cart-btn">
                Add to Cart
            </button>
        </div>
    `).join("");
}

// ========== FILTER PRODUCTS ==========
function filterProducts() {
    const search = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const category = document.getElementById("categoryFilter")?.value || "all";

    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search);
        const matchesCategory = category === "all" || product.category === category;
        return matchesSearch && matchesCategory;
    });

    displayProducts(filtered);
}

// ========== ADD TO CART ==========
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
    showNotification(productName + " added to cart!");
}

// ========== REMOVE FROM CART ==========
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

// ========== UPDATE QUANTITY ==========
function updateQuantity(productName, newQuantity) {
    const item = cart.find(item => item.name === productName);
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productName);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
        }
    }
}

// ========== UPDATE CART DISPLAY ==========
function updateCartDisplay() {
    const cartContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotalElement) cartTotalElement.textContent = '₹0';
        return;
    }

    let total = 0;
    let cartHTML = '<ul class="cart-list">';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartHTML += `
            <li class="cart-item">
                <span class="item-name">${item.name}</span>
                <div class="item-controls">
                    <button onclick="updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
                    <span class="item-price">₹${itemTotal}</span>
                    <button onclick="removeFromCart('${item.name}')" class="remove-btn">×</button>
                </div>
            </li>
        `;
    });

    cartHTML += '</ul>';
    cartContainer.innerHTML = cartHTML;

    if (cartTotalElement) cartTotalElement.textContent = "₹" + total;
}

// ========== UPDATE CART COUNT ==========
function updateCartCount() {
    const navCartCount = document.getElementById('navCartCount');
    const cartCount = document.getElementById('cartCount');
    const cartCountMobile = document.getElementById('cartCountMobile');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (navCartCount) navCartCount.textContent = totalItems;
    if (cartCount) cartCount.textContent = totalItems;
    if (cartCountMobile) cartCountMobile.textContent = totalItems;
}

// ========== CLEAR CART ==========
function clearCart() {
    if (cart.length === 0) {
        alert("Cart is already empty");
        return;
    }
    
    if (confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
        showNotification("Cart cleared");
    }
}

// ========== SEND WHATSAPP ORDER ==========
function sendOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to order.");
        return;
    }

    const name = document.getElementById('customerName')?.value.trim();
    const contact = document.getElementById('customerContact')?.value.trim();

    if (!name) {
        alert("Please enter your name");
        document.getElementById('customerName')?.focus();
        return;
    }

    if (!contact) {
        alert("Please enter your contact number");
        document.getElementById('customerContact')?.focus();
        return;
    }

    // Format phone number (remove any non-digits)
    const phoneNumber = contact.replace(/\D/g, '');
    if (phoneNumber.length < 10) {
        alert("Please enter a valid 10-digit phone number");
        return;
    }

    // Build order message
    let message = "Hello, I want to order:%0A%0A";
    
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `• ${item.name} x${item.quantity} = ₹${itemTotal}%0A`;
    });
    
    message += `%0ATotal: ₹${total}%0A%0A`;
    message += `Name: ${name}%0A`;
    message += `Contact: ${contact}`;

    // Your WhatsApp number (replace with your actual number)
    const whatsappNumber = "917993574535"; // Remove any + or spaces
    
    // Open WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    
    // Optional: Close cart after order
    setTimeout(() => {
        closeCart();
    }, 500);
}

// ========== SHOW NOTIFICATION ==========
function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerText = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ========== INITIALIZE ON PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
    // Update cart display
    updateCartDisplay();
    updateCartCount();
    
    // Display products if on products page
    if (document.getElementById('productsGrid')) {
        displayProducts(products);
    }
    
    // Setup search and filter listeners
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    
    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterProducts);
    }
    
    // Setup cart icon click
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    }
    
    // Setup cart toggle button
    const cartToggleBtn = document.getElementById('cartToggleBtn');
    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    }
    
    // Setup close cart button
    const closeCartBtn = document.getElementById('closeCartBtn');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeCart();
        });
    }
    
    // Setup overlay click
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            closeCart();
        });
    }
    
    // Setup mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Set active nav link
    const currentLocation = window.location.pathname;
    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });
});