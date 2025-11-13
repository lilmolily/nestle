// script.js

// --- Basic product data (Hoodies & Jackets, 20 items) ---
const productList = [
    { id: 1, name: "Classic Hoodie", price: 49.99, desc: "Soft cotton blend hoodie with a clean, classic fit.", stock: 50 },
    { id: 2, name: "Zip-Up Hoodie", price: 59.99, desc: "Full-zip hoodie with reinforced seams and kangaroo pockets.", stock: 40 },
    { id: 3, name: "Oversized Hoodie", price: 54.99, desc: "Relaxed oversized fit for a contemporary streetwear look.", stock: 30 },
    { id: 4, name: "Denim Jacket", price: 79.99, desc: "Durable denim jacket with classic button front and pockets.", stock: 25 },
    { id: 5, name: "Leather Jacket", price: 199.00, desc: "Premium faux-leather jacket with tailored silhouette.", stock: 12 },
    { id: 6, name: "Windbreaker Jacket", price: 69.50, desc: "Lightweight, water-resistant windbreaker for breezy days.", stock: 35 },
    { id: 7, name: "Puffer Jacket", price: 119.99, desc: "Insulated puffer jacket with warm synthetic fill and hood.", stock: 18 },
    { id: 8, name: "Fleece Hoodie", price: 44.00, desc: "Cozy fleece hoodie with brushed interior for extra warmth.", stock: 45 },
    { id: 9, name: "Quilted Jacket", price: 129.00, desc: "Lightweight quilted jacket with thermal lining.", stock: 22 },
    { id: 10, name: "Bomber Jacket", price: 89.99, desc: "Classic bomber with ribbed cuffs and hem.", stock: 28 },
    { id: 11, name: "Track Hoodie", price: 39.99, desc: "Sporty track hoodie with breathable fabric.", stock: 60 },
    { id: 12, name: "Cropped Hoodie", price: 42.50, desc: "Cropped length hoodie for a modern silhouette.", stock: 26 },
    { id: 13, name: "Sherpa Jacket", price: 99.99, desc: "Soft sherpa-lined jacket for cozy warmth.", stock: 19 },
    { id: 14, name: "Trench Jacket", price: 149.00, desc: "Water-resistant trench with tailored fit and belt.", stock: 14 },
    { id: 15, name: "Varsity Jacket", price: 109.99, desc: "Retro varsity jacket with contrast sleeves.", stock: 16 },
    { id: 16, name: "Moto Jacket", price: 189.00, desc: "Edgy moto-style faux-leather jacket with zip detailing.", stock: 10 },
    { id: 17, name: "Rain Jacket", price: 64.99, desc: "Packable waterproof jacket for wet weather.", stock: 33 },
    { id: 18, name: "Thermal Hoodie", price: 46.99, desc: "Insulating thermal hoodie for cooler days.", stock: 44 },
    { id: 19, name: "Performance Hoodie", price: 54.00, desc: "Moisture-wicking hoodie for training and running.", stock: 38 },
    { id: 20, name: "Parka Jacket", price: 159.00, desc: "Heavy-duty parka with faux-fur trimmed hood.", stock: 9 }
];

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

        // Try to get an image from the backend image proxy. Falls back to source.unsplash if the proxy fails.
        let imageUrl = `https://source.unsplash.com/400x300/?hoodie,jacket,${encodeURIComponent(prod.name.split(' ')[0])}&sig=${prod.id}`;
        try {
            const resp = await fetch(`http://localhost:3000/images?query=${encodeURIComponent(prod.name)}`);
            if (resp.ok) {
                const data = await resp.json();
                if (data && data.url) imageUrl = data.url;
            }
        } catch (err) {
            // ignore and use fallback
            console.warn('Image fetch failed, using fallback image for', prod.name);
        }

        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${imageUrl}" class="card-img-top" alt="${prod.name}" loading="lazy">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${prod.name}</h5>
                    <p class="card-text text-secondary">${prod.desc}</p>
                    <p class="card-text fw-bold mt-auto fs-4">$${prod.price.toFixed(2)}</p>
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
                    
                    <span class="fw-bold me-3">$${(item.price * item.qty).toFixed(2)}</span>

                    <button type="button" class="btn btn-danger btn-sm btn-remove-item" data-id="${item.id}" aria-label="Remove button">❌</button>
                </div>
            `;
            cartListEl.appendChild(li);
        });
    }

    // Update totals and counts
    totalEl.innerText = total.toFixed(2);
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

    const total = parseFloat(totalEl.innerText);

    const order = {
        customer: { name, email, address },
        items: cart,
        total: total,
    };

    // POST to backend (simulated or real)
    try {
        // This fetch will communicate with the server.js you successfully ran on http://localhost:3000
        const res = await fetch('http://localhost:3000/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });

        if (!res.ok) {
            throw new Error('Server error during checkout.');
        }

        const data = await res.json();
        
        // Success
        alert(`Order placed! Order ID: ${data.orderId}`);
        
        // Clear cart and form
        cart = [];
        saveCart();
        renderCart();
        checkoutForm.reset();

    } catch (err) {
        // Alert on error when placing order
        alert('There was an error placing the order. Please ensure your Node.js server is running.');
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

            const data = await res.json();
            if (res.ok && data.success) {
                statusEl.innerText = 'Message sent — thank you!';
                contactForm.reset();
            } else {
                statusEl.innerText = data.message || 'Error sending message.';
            }
        } catch (err) {
            console.error('Contact send error', err);
            statusEl.innerText = 'Unable to reach server. Please try again later.';
        }
    });
}

// --- Initialization ---
renderProducts();
renderCart();