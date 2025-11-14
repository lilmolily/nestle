// script.js

const PEXELS_API_KEY = "zMdhk5QB6WkxyVU5p1mAzU9HTYHMHjJcu5piEs8OYwkwyKmNrUhSt0VC";

const CURRENCY = '₱';

const productList = [
    { id: 1, name: "Classic Hoodie", price: 949.99, desc: "Soft cotton blend hoodie with a clean, classic fit.", stock: 50, image: "https://via.placeholder.com/400x280?text=Classic+Hoodie" },
    { id: 2, name: "Zip-Up Hoodie", price: 959.99, desc: "Full-zip hoodie with reinforced seams and kangaroo pockets.", stock: 40, image: "https://via.placeholder.com/400x280?text=Zip-Up+Hoodie" },
    { id: 3, name: "Oversized Hoodie", price: 954.99, desc: "Relaxed oversized fit for a contemporary streetwear look.", stock: 30, image: "https://via.placeholder.com/400x280?text=Oversized+Hoodie" },
    { id: 4, name: "Denim Jacket", price: 979.99, desc: "Durable denim jacket with classic button front and pockets.", stock: 25, image: "https://via.placeholder.com/400x280?text=Denim+Jacket" },
    { id: 5, name: "Leather Jacket", price: 1199.00, desc: "Premium faux-leather jacket with tailored silhouette.", stock: 12, image: "https://via.placeholder.com/400x280?text=Leather+Jacket" },
    { id: 6, name: "Windbreaker Jacket", price: 969.50, desc: "Lightweight, water-resistant windbreaker for breezy days.", stock: 35, image: "https://via.placeholder.com/400x280?text=Windbreaker+Jacket" },
    { id: 7, name: "Puffer Jacket", price: 1119.99, desc: "Insulated puffer jacket with warm synthetic fill and hood.", stock: 18, image: "https://via.placeholder.com/400x280?text=Puffer+Jacket" },
    { id: 8, name: "Fleece Hoodie", price: 944.00, desc: "Cozy fleece hoodie with brushed interior for extra warmth.", stock: 45, image: "https://via.placeholder.com/400x280?text=Fleece+Hoodie" },
    { id: 9, name: "Quilted Jacket", price: 1129.00, desc: "Lightweight quilted jacket with thermal lining.", stock: 22, image: "https://via.placeholder.com/400x280?text=Quilted+Jacket" },
    { id: 10, name: "Bomber Jacket", price: 989.99, desc: "Classic bomber with ribbed cuffs and hem.", stock: 28, image: "https://via.placeholder.com/400x280?text=Bomber+Jacket" },
    { id: 11, name: "Track Hoodie", price: 939.99, desc: "Sporty track hoodie with breathable fabric.", stock: 60, image: "https://via.placeholder.com/400x280?text=Track+Hoodie" },
    { id: 12, name: "Cropped Hoodie", price: 942.50, desc: "Cropped length hoodie for a modern silhouette.", stock: 26, image: "https://via.placeholder.com/400x280?text=Cropped+Hoodie" },
    { id: 13, name: "Sherpa Jacket", price: 999.99, desc: "Soft sherpa-lined jacket for cozy warmth.", stock: 19, image: "https://via.placeholder.com/400x280?text=Sherpa+Jacket" },
    { id: 14, name: "Trench Jacket", price: 1149.00, desc: "Water-resistant trench with tailored fit and belt.", stock: 14, image: "https://via.placeholder.com/400x280?text=Trench+Jacket" },
    { id: 15, name: "Varsity Jacket", price: 1109.99, desc: "Retro varsity jacket with contrast sleeves.", stock: 16, image: "https://via.placeholder.com/400x280?text=Varsity+Jacket" },
    { id: 16, name: "Moto Jacket", price: 1189.00, desc: "Edgy moto-style faux-leather jacket with zip detailing.", stock: 10, image: "https://via.placeholder.com/400x280?text=Moto+Jacket" },
    { id: 17, name: "Rain Jacket", price: 964.99, desc: "Packable waterproof jacket for wet weather.", stock: 33, image: "https://via.placeholder.com/400x280?text=Rain+Jacket" },
    { id: 18, name: "Thermal Hoodie", price: 946.99, desc: "Insulating thermal hoodie for cooler days.", stock: 44, image: "https://via.placeholder.com/400x280?text=Thermal+Hoodie" },
    { id: 19, name: "Performance Hoodie", price: 954.00, desc: "Moisture-wicking hoodie for training and running.", stock: 38, image: "https://via.placeholder.com/400x280?text=Performance+Hoodie" },
    { id: 20, name: "Parka Jacket", price: 1159.00, desc: "Heavy-duty parka with faux-fur trimmed hood.", stock: 9, image: "https://via.placeholder.com/400x280?text=Parka+Jacket" }
];


const formatCurrency = (value) => {
    try {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
    } catch (e) {
        return `${CURRENCY}${value.toFixed(2)}`;
    }
};

// Fetch a product image from Pexels (returns a URL). Falls back to the provided fallback or Unsplash Source.
async function fetchProductImage(query, fallback) {
    try {
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + ' shoes')}&per_page=1`;
        const res = await fetch(url, {
            headers: { Authorization: PEXELS_API_KEY }
        });
        if (!res.ok) throw new Error(`Pexels ${res.status}`);
        const data = await res.json();
        if (data && data.photos && data.photos.length > 0 && data.photos[0].src) {
            return data.photos[0].src.medium || data.photos[0].src.large || data.photos[0].src.original;
        }
    } catch (err) {
        console.warn('Pexels fetch failed for', query, err && err.message ? err.message : err);
    }
    return fallback || `https://source.unsplash.com/400x280/?${encodeURIComponent(query)}`;
}

// --- DOM Elements ---
const productListEl = document.getElementById('product-list');
const cartEl = document.getElementById('cart-section');
const cartListEl = document.getElementById('cart-list');
const cartCountEl = document.getElementById('cart-count');
const totalEl = document.getElementById('total');
const checkoutForm = document.getElementById('checkout-form');
const confirmCheckoutBtn = document.getElementById('confirm-checkout');

// Initialize cart from localStorage or as an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// --- Cart Persistence and Rendering ---

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

async function renderProducts() {
    productListEl.innerHTML = ''; // Clear existing content

    for (const prod of productList) {
        const col = document.createElement('div');
        col.className = 'col';

        // Use Pexels via client-side fetch; fall back to product's image or Unsplash Source
        const fallbackUrl = prod.image || `https://source.unsplash.com/400x300/?${encodeURIComponent(prod.name)}&sig=${prod.id}`;
        let imageUrl = await fetchProductImage(prod.name, fallbackUrl);

        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${imageUrl}" onerror="this.onerror=null;this.src='${fallbackUrl}';" class="card-img-top" alt="${prod.name}" loading="lazy">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${prod.name}</h5>
                    <p class="card-text text-secondary">${prod.desc}</p>
                    <p class="card-text fw-bold mt-auto fs-4">${formatCurrency(prod.price)}</p>
                    <button class="btn btn-primary mt-3 btn-add-to-cart" data-id="${prod.id}">Add to Cart</button>
                </div>
            </div>
        `;
        productListEl.appendChild(col);
    }

    // Attach event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            addToCart(id);
        });
    });
}

function addToCart(id) {
    const prod = productList.find(p => p.id === id);
    const item = cart.find(i => i.id === id);

    if (item) {
        // Item is already in cart, increase quantity
        item.qty += 1;
    } else {
        // Item is not in cart, add new item object
        if (prod) {
            cart.push({ id: prod.id, name: prod.name, price: prod.price, qty: 1 });
        }
    }

    saveCart();
    renderCart();
}

function updateCart(id, delta) {
    const item = cart.find(i => i.id === id);
    
    if (item) {
        item.qty += delta;
        
        // Remove item if quantity drops to 0 or below
        if (item.qty <= 0) {
            removeFromCart(id);
            return;
        }

        saveCart();
        renderCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
}

function renderCart() {
    cartListEl.innerHTML = ''; // Clear existing cart
    let total = 0;

    if (cart.length === 0) {
        cartListEl.innerHTML = '<li class="list-group-item text-center text-muted">Your cart is empty.</li>';
        document.getElementById('checkout-container').style.display = 'none';
    } else {
        document.getElementById('checkout-container').style.display = 'block';

        cart.forEach(item => {
            total += item.price * item.qty;

            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            li.innerHTML = `
                <span class="text-truncate" style="max-width: 50%;">${item.name} <strong class="text-muted">(x${item.qty})</strong></span>
                <div class="d-flex align-items-center">
                    <div class="btn-group btn-group-sm me-3" role="group" aria-label="Quantity controls">
                        <button type="button" class="btn btn-outline-secondary btn-update-cart" data-action="decrease" data-id="${item.id}">-</button>
                        <button type="button" class="btn btn-outline-secondary disabled">${item.qty}</button>
                        <button type="button" class="btn btn-outline-secondary btn-update-cart" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                    
                    <span class="fw-bold me-3">${formatCurrency(item.price * item.qty)}</span>

                    <button type="button" class="btn btn-danger btn-sm btn-remove-item" data-id="${item.id}" aria-label="Remove button">❌</button>
                </div>
            `;
            cartListEl.appendChild(li);
        });
    }

    // Update totals and counts
    totalEl.innerText = formatCurrency(total);
    cartCountEl.innerText = cart.reduce((sum, item) => sum + item.qty, 0); // Total items in cart
    document.getElementById('cart-total-items').innerText = cart.length; // Number of unique items

    // Attach cart button listeners (must be done after rendering)
    document.querySelectorAll('.btn-update-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const action = e.currentTarget.dataset.action;
            const delta = action === 'increase' ? 1 : -1;
            updateCart(id, delta);
        });
    });

    document.querySelectorAll('.btn-remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            removeFromCart(id);
        });
    });
}

// --- Checkout Logic ---

confirmCheckoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    // Form validation
    const name = document.getElementById('customer-name').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    if (!name || !email || !address) {
        alert('Please fill out all checkout fields.');
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    // Compute numeric total from cart to avoid parsing formatted string
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const order = {
        customer: { name, email, address },
        items: cart,
        total: total,
    };

    // Try to POST to backend; if backend is unavailable or returns an error
    // fallback to a client-side mock so checkout still completes in frontend-only mode.
    try {
        const res = await fetch('http://localhost:3000/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        });

        if (res.ok) {
            const data = await res.json();
            alert(`Order placed! Order ID: ${data.orderId}`);
            cart = [];
            saveCart();
            renderCart();
            checkoutForm.reset();
            return;
        }

        // If server replies but with non-OK (e.g. 410 Gone), fall back to mock below
        console.warn('Backend returned non-OK status, falling back to client mock', res.status);
    } catch (err) {
        console.warn('Backend request failed, using client-side mock order', err && err.message ? err.message : err);
    }

    // Client-side mock order (frontend-only). Persist mock orders to localStorage.
    try {
        const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        const mockId = `MOCK-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*900+100)}`;
        const mockOrder = { orderId: mockId, customer: order.customer, items: order.items, total: order.total, createdAt: new Date().toISOString() };
        mockOrders.push(mockOrder);
        localStorage.setItem('mockOrders', JSON.stringify(mockOrders));

        alert(`Order placed (mock)! Order ID: ${mockId}`);
        cart = [];
        saveCart();
        renderCart();
        checkoutForm.reset();
    } catch (err) {
        console.error('Unable to save mock order', err);
        alert('There was an error placing the order. Please try again.');
    }
});

// --- Contact form logic (sends to backend /contact) ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-message').value.trim();
        const statusEl = document.getElementById('contact-status');

        if (!name || !email || !message) {
            statusEl.innerText = 'Please fill all fields.';
            return;
        }

        statusEl.innerText = 'Sending...';

        try {
                const res = await fetch('http://localhost:3000/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data && data.success) {
                        statusEl.innerText = 'Message sent — thank you!';
                        contactForm.reset();
                        return;
                    }
                }

                // If server not available or returned non-ok, fall back to client-side mock
                console.warn('Contact endpoint not available or returned non-ok, falling back to client mock');
                const mockContacts = JSON.parse(localStorage.getItem('mockContacts') || '[]');
                mockContacts.push({ name, email, message, createdAt: new Date().toISOString() });
                localStorage.setItem('mockContacts', JSON.stringify(mockContacts));
                statusEl.innerText = 'Message saved locally — thank you!';
                contactForm.reset();
        } catch (err) {
                console.error('Contact send error, saved locally instead', err);
                const mockContacts = JSON.parse(localStorage.getItem('mockContacts') || '[]');
                mockContacts.push({ name, email, message, createdAt: new Date().toISOString() });
                localStorage.setItem('mockContacts', JSON.stringify(mockContacts));
                statusEl.innerText = 'Unable to reach server. Message saved locally.';
        }
    });
}

// --- Initialization ---
renderProducts();
renderCart();