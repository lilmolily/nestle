require('dotenv').config();
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://franconicelyjane:nicely@cluster0.g0xbeuh.mongodb.net/corezip';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// Import Routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

// Use Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Serve frontend static files (when deploying both frontend+backend on the same service)
const frontendPath = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
}

// Note: frontend is hosted separately as a static site (recommended).
// If you prefer the backend to serve static files, re-enable static serving here.

// Root endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Core Zip Backend API is running!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Catch-all: serve index.html for any non-API routes (enables client routing)
app.get('*', (req, res) => {
  // Let API routes return 404/handled above
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }

  const indexFile = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }

  return res.status(404).send('Not Found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});