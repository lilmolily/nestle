// admin.js - Admin Dashboard JavaScript

const PEXELS_API_KEY = "zMdhk5QB6WkxyVU5p1mAzU9HTYHMHjJcu5piEs8OYwkwyKmNrUhSt0VC";
const API_BASE_URL = "https://nestle-k2zh.onrender.com/api"; // Render backend URL

let products = [];

// LocalStorage helpers for admin-created products (used when backend is unavailable)
function getAdminProducts() {
    // Prefer the up-to-date key used by the storefront (`adminProductsUpdated`) but fall back to older key `adminProducts`.
    const updated = localStorage.getItem('adminProductsUpdated') || localStorage.getItem('adminProducts');
    return updated ? JSON.parse(updated) : [];
}

function saveAdminProducts(list) {
    localStorage.setItem('adminProducts', JSON.stringify(list));
    // Also set adminProductsUpdated so the storefront can pick up new products immediately
    localStorage.setItem('adminProductsUpdated', JSON.stringify(list));
}

// Check if admin is authenticated
function checkAdminAuth() {
    if (!localStorage.getItem('adminToken')) {
        window.location.href = 'admin-login.html';
    }
}

// Load products from backend
async function loadProducts() {
    try {
        const res = await fetch(`${API_BASE_URL}/products`);
        if (res.ok) {
            const data = await res.json();
            products = data.map(p => ({
                id: p._id,
                name: p.name,
                price: p.price,
                desc: p.description,
                stock: p.stock,
                image: p.imageUrl,
            }));
            return products;
        }
    } catch (err) {
        console.warn('Failed to load from backend, using localStorage:', err);
    }

    // Fallback to localStorage
    const stored = localStorage.getItem('adminProducts');
    if (stored) {
        products = JSON.parse(stored);
    }
    return products;
}

// Fetch images from Pexels API
async function searchPexelsImages(query) {
    try {
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6`;
        const res = await fetch(url, {
            headers: { Authorization: PEXELS_API_KEY }
        });
        if (!res.ok) throw new Error(`Pexels ${res.status}`);
        const data = await res.json();
        return data.photos || [];
    } catch (err) {
        console.error('Pexels search failed:', err);
        alert('Failed to search images. Please check your internet connection.');
        return [];
    }
}

// Render products in the table
function renderProductsTable() {
    const products = getAdminProducts();
    const tbody = document.getElementById('products-table-body');
    const countEl = document.getElementById('product-count');
    
    tbody.innerHTML = '';
    countEl.textContent = products.length;

    products.forEach(prod => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${prod.id}</td>
            <td>
                <img src="${prod.image}" alt="${prod.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'">
            </td>
            <td>${prod.name}</td>
            <td>₱${prod.price.toFixed(2)}</td>
            <td>${prod.stock}</td>
            <td>${prod.desc.substring(0, 40)}...</td>
            <td>
                <button class="btn btn-edit btn-sm" data-id="${prod.id}">Edit</button>
                <button class="btn btn-delete btn-sm" data-id="${prod.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);

        // Add edit and delete listeners
        row.querySelector('.btn-edit').addEventListener('click', () => loadProductForEdit(prod.id));
        row.querySelector('.btn-delete').addEventListener('click', () => deleteProduct(prod.id));
    });
}

// Load product data into form for editing
function loadProductForEdit(productId) {
    const products = getAdminProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-desc').value = product.desc;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-image-url').value = product.image;
        
        // Show image preview
        const preview = document.getElementById('product-image-preview');
        preview.src = product.image;
        preview.style.display = 'block';
        document.getElementById('image-url-display').textContent = product.image.substring(0, 50) + '...';

        // Update form UI
        document.getElementById('form-title').textContent = `Edit Product #${productId}`;
        document.getElementById('submit-btn').textContent = 'Update Product';
        document.getElementById('cancel-edit-btn').style.display = 'inline-block';
        
        // Store editing product ID
        document.getElementById('product-form').dataset.editingId = productId;
        
        // Scroll to form
        document.querySelector('.product-form-container').scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete product
function deleteProduct(productId) {
    if (confirm(`Are you sure you want to delete product #${productId}?`)) {
        let products = getAdminProducts();
        products = products.filter(p => p.id !== productId);
        saveAdminProducts(products);
        renderProductsTable();
        alert('Product deleted successfully!');
    }
}

// Reset form to add mode
function resetFormToAddMode() {
    document.getElementById('product-form').reset();
    document.getElementById('product-form').dataset.editingId = '';
    document.getElementById('form-title').textContent = 'Add New Product';
    document.getElementById('submit-btn').textContent = 'Add Product';
    document.getElementById('cancel-edit-btn').style.display = 'none';
    document.getElementById('product-image-preview').style.display = 'none';
    document.getElementById('image-url-display').textContent = 'None';
    document.getElementById('product-image-url').value = '';
}

// Handle form submission
document.addEventListener('DOMContentLoaded', async function() {
    checkAdminAuth();
    await loadProducts();
    renderProductsTable();

    document.getElementById('product-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('product-name').value.trim();
        const price = parseFloat(document.getElementById('product-price').value);
        const desc = document.getElementById('product-desc').value.trim();
        const stock = parseInt(document.getElementById('product-stock').value);
        const imageUrl = document.getElementById('product-image-url').value || 'https://via.placeholder.com/400x280?text=No+Image';
        const editingId = this.dataset.editingId;

        const payload = {
            name,
            price,
            description: desc,
            stock,
            imageUrl,
        };

        // Optimistic local update: show product immediately in admin UI while attempting backend save
        let tempLocalId = null;
        if (!editingId) {
            tempLocalId = `LOCAL-${Date.now()}`;
            // Avoid duplicating if loadProducts already provided products
            products = getAdminProducts();
            products.push({ id: tempLocalId, name: name, price: price, desc: desc, stock: stock, image: imageUrl });
            saveAdminProducts(products);
            renderProductsTable();
            // Keep form until backend confirms (so admin can see the added item)
        }

        try {
            if (editingId) {
                // Update existing product via backend
                const res = await fetch(`${API_BASE_URL}/products/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (res.ok) {
                    alert('Product updated successfully!');
                    this.dataset.editingId = '';
                    document.getElementById('form-title').textContent = 'Add New Product';
                    document.getElementById('submit-btn').textContent = 'Add Product';
                    document.getElementById('cancel-edit-btn').style.display = 'none';
                    await loadProducts();
                    renderProductsTable();
                    this.reset();
                    return;
                }
                throw new Error('Failed to update product');
            } else {
                // Add new product via backend
                const res = await fetch(`${API_BASE_URL}/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (res.ok) {
                    alert('Product added successfully!');
                    // Replace local optimistic list with server list
                    await loadProducts();
                    renderProductsTable();
                    this.reset();
                    return;
                }
                throw new Error('Failed to add product');
            }
        } catch (err) {
            console.warn('Backend error, falling back to localStorage:', err);
            // Fallback to localStorage
            // If editing, update the existing local product
            if (editingId) {
                const product = products.find(p => p.id === editingId);
                if (product) {
                    product.name = name;
                    product.price = price;
                    product.desc = desc;
                    product.stock = stock;
                    product.image = imageUrl;
                    alert('Product updated (local)!');
                }
            } else {
                // If optimistic insert already added a temp item, keep it; otherwise add a new one
                products = getAdminProducts();
                if (!products.find(p => p.id === tempLocalId)) {
                    const newId = products.length > 0 ? Math.max(...products.map(p => parseInt(p.id) || 0)) + 1 : 1;
                    products.push({ id: String(newId), name: name, price: price, desc: desc, stock: stock, image: imageUrl });
                }
                alert('Product added locally (backend unavailable).');
            }

            saveAdminProducts(products);
            renderProductsTable();
            resetFormToAddMode();
        }
    });

    // Handle image search
    document.getElementById('search-image-btn').addEventListener('click', async function() {
        const query = document.getElementById('product-image-search').value.trim();
        if (!query) {
            alert('Please enter a search term for images.');
            return;
        }

        const loading = document.getElementById('image-loading');
        const results = document.getElementById('image-results');
        
        loading.style.display = 'block';
        results.style.display = 'none';
        results.innerHTML = '';

        const images = await searchPexelsImages(query);
        loading.style.display = 'none';

        if (images.length === 0) {
            alert('No images found. Try a different search term.');
            return;
        }

        results.style.display = 'block';
        results.innerHTML = '<h6>Select an image:</h6>';
        
        images.forEach(photo => {
            const imgOption = document.createElement('div');
            imgOption.className = 'image-option';
            imgOption.innerHTML = `
                <img src="${photo.src.small}" alt="${photo.alt || 'Image'}" style="width: 100%; max-height: 100px; object-fit: cover; border-radius: 4px;">
                <small class="d-block mt-2">${photo.photographer}</small>
            `;
            
            imgOption.addEventListener('click', function() {
                // Remove previous selection
                document.querySelectorAll('.image-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                // Set selected image
                const imageUrl = photo.src.medium || photo.src.large;
                document.getElementById('product-image-url').value = imageUrl;
                
                const preview = document.getElementById('product-image-preview');
                preview.src = imageUrl;
                preview.style.display = 'block';
                document.getElementById('image-url-display').textContent = imageUrl.substring(0, 50) + '...';
            });
            
            results.appendChild(imgOption);
        });
    });

    // Handle cancel edit button
    document.getElementById('cancel-edit-btn').addEventListener('click', function() {
        resetFormToAddMode();
    });

    // Handle reset button
    document.getElementById('reset-form-btn').addEventListener('click', function() {
        resetFormToAddMode();
    });

    // Handle logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('adminToken');
        window.location.href = 'admin-login.html';
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});
