# Nestle (simple e-commerce demo)

This repository contains a small frontend and backend demo for a simple e-commerce UI.

- Frontend: `frontend/` (HTML, CSS, JS)
- Backend: `backend/` (Node.js simple server)

What I changed recently
- Replaced example gadget products with Hoodies & Jackets
- Updated the background to Pantone Imperial Blue (#001D51)
- Added product images using Unsplash Source and expanded the product list to 20 items

Quick local run (frontend only)

1. Open the frontend in your browser:

   - Double-click `frontend/index.html`, or
   - Serve it locally (recommended) to avoid mixed-content issues when using fetch:

     ```powershell
     python -m http.server 5500 --directory "c:\Users\Acer\Desktop\nestle\frontend"
     # then open http://localhost:5500
     ```

Backend (optional)

1. Ensure Node.js is installed.
2. Start the backend server (from repo root):

   ```powershell
   node "c:\Users\Acer\Desktop\nestle\backend\server.js"
   ```

Connecting to GitHub

If you want me to add a remote and push commits, provide the GitHub repo URL (SSH or HTTPS). If your machine has SSH keys or you can authenticate via HTTPS, I can add the remote and push.

Commands I ran locally as part of setup:

```powershell
# initialize git, add files, commit
git init
git add .
git commit -m "Initial commit: frontend + backend, apparel products, UI updates"
```

If you'd like, I can:
- Add the GitHub remote and push (provide repo URL). 
- Create a GitHub repo for you (requires a GitHub token or `gh` CLI and your confirmation).
# nestle
