

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Use the provided Unsplash API key for server-side image fetching
const UNSPLASH_KEY = 'JHDieSZsYiYnTdd1euPjn1sXaGoqNPHXH1n4pHCybVLx2g9SpGt2FDHe';

app.use(cors());
app.use(express.json());

let orderCounter = 1000;

app.post('/checkout', (req, res) => {
    const orderData = req.body;

    if (!orderData || !orderData.items || orderData.items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Cart is empty or invalid data provided.'
        });
    }

    orderCounter++;
    const newOrderId = `ORD-${orderCounter}`;

    console.log(`\n--- RECEIVED NEW ORDER (${newOrderId}) ---`);
    console.log(`Customer: ${orderData.customer.name}`);
    console.log(`Total: $${orderData.total.toFixed(2)}`);
    console.log(`Items Count: ${orderData.items.length}`);
    console.log('-------------------------------------\n');

    res.json({
        success: true,
        orderId: newOrderId,
        message: 'Order processed successfully.'
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`Backend ready to receive checkout requests.`);
});

// Contact endpoint: accept name, email, message and log it (simple demo)
app.post('/contact', (req, res) => {
    const contact = req.body;

    if (!contact || !contact.name || !contact.email || !contact.message) {
        return res.status(400).json({ success: false, message: 'Missing contact fields.' });
    }

    console.log('\n--- RECEIVED CONTACT MESSAGE ---');
    console.log(`Name: ${contact.name}`);
    console.log(`Email: ${contact.email}`);
    console.log(`Message: ${contact.message}`);
    console.log('--------------------------------\n');

    // In a real app you'd forward this to email or a CRM. Here we just acknowledge receipt.
    res.json({ success: true, message: 'Message received. Thank you!' });
});

// Images proxy: uses Unsplash Search API to return a small image url for a query
app.get('/images', async (req, res) => {
    const query = req.query.query || 'hoodie';

    try {
        // Use global fetch (Node 18+) to call Unsplash. If your Node version doesn't support fetch,
        // install node-fetch and require it at the top.
        const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`;
        const resp = await fetch(apiUrl, {
            headers: {
                Authorization: `Client-ID ${UNSPLASH_KEY}`
            }
        });

        if (!resp.ok) {
            throw new Error(`Unsplash error: ${resp.status}`);
        }

        const data = await resp.json();

        if (data && data.results && data.results.length > 0) {
            // Return the small-sized image for faster loading
            return res.json({ url: data.results[0].urls.small });
        }

        // Fallback to Unsplash source if no results
        return res.json({ url: `https://source.unsplash.com/400x300/?${encodeURIComponent(query)}` });
    } catch (err) {
        console.error('Image proxy error:', err.message || err);
        return res.json({ url: `https://source.unsplash.com/400x300/?${encodeURIComponent(query)}` });
    }
});