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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});