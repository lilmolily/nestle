// Simple static server for the frontend using Express
// Run: node frontend/server.js

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;

// Serve static files from this folder (frontend)
app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
});
