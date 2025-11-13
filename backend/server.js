// Backend functionality intentionally disabled.
// The original server.js has been replaced with a disabled stub so POST
// requests (e.g. /checkout or /contact) return 410 Gone. This prevents
// the backend from processing orders while keeping the repository intact.

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('*', (req, res) => {
  res.status(410).json({ success: false, message: 'Backend disabled by user. Server removed.' });
});

app.get('*', (req, res) => {
  res.status(410).send('Backend disabled by user.');
});

app.listen(PORT, () => console.log(`Backend disabled stub listening on port ${PORT}`));

// Image proxy removed. Client now fetches images directly from Unsplash per user request.