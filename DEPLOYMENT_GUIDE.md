# Core Zip E-Commerce Platform - Full Deployment Guide

## 📋 Table of Contents
1. [GitHub Setup](#github-setup)
2. [Local Development](#local-development)
3. [Backend Deployment to Render](#backend-deployment-to-render)
4. [Frontend Deployment](#frontend-deployment)
5. [MongoDB Setup](#mongodb-setup)

---

## GitHub Setup

### Prerequisites
- [Git for Windows](https://git-scm.com/download/win)
- [GitHub Account](https://github.com)

### Steps

1. **Install Git** (if not already installed)
   - Download from https://git-scm.com/download/win
   - Run installer with default settings

2. **Open PowerShell** and configure Git:
   ```powershell
   git config --global user.name "Your GitHub Username"
   git config --global user.email "your-email@example.com"
   ```

3. **Navigate to project**:
   ```powershell
   cd "c:\Users\nicely jane\OneDrive\Desktop\nestle-20251114T213440Z-1-001\nestle"
   ```

4. **Initialize Git repository**:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit: Core Zip e-commerce platform with Node.js backend"
   ```

5. **Add remote and push**:
   ```powershell
   git remote add origin https://github.com/lilmolily/nestle.git
   git branch -M main
   git push -u origin main
   ```

   **Note**: Use a [Personal Access Token](https://github.com/settings/tokens) as password when prompted.

---

## Local Development

### Backend Setup

1. **Install dependencies**:
   ```powershell
   cd backend
   npm install
   ```

2. **Create `.env` file** (if not exists):
   ```
   MONGODB_URI=mongodb+srv://franconicelyjane:nicely@cluster0.g0xbeuh.mongodb.net/corezip
   PORT=5000
   NODE_ENV=development
   ```

3. **Start server**:
   ```powershell
   npm start
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **No installation needed** - open `frontend/index.html` in browser or use a local server:
   ```powershell
   # Using Python (if installed)
   python -m http.server 8000 --directory frontend
   
   # Or use VS Code Live Server extension
   ```

2. **Verify API connection**: Check that `script.js` and `admin.js` have correct `API_BASE_URL`:
   ```javascript
   const API_BASE_URL = "http://localhost:5000/api";
   ```

---

## Backend Deployment to Render

### Steps

1. **Ensure GitHub repo is up to date**:
   ```powershell
   cd backend
   npm install
   npm start
   # Test locally before deploying
   ```

2. **Go to [Render Dashboard](https://dashboard.render.com)**

3. **Create new Web Service**:
   - Click "New +" → "Web Service"
   - Select your GitHub repository (`lilmolily/nestle`)
   - Configure:
     - **Name**: `core-zip-backend`
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

4. **Set Environment Variables**:
   - Click "Environment"
   - Add variable:
     ```
     MONGODB_URI=mongodb+srv://franconicelyjane:nicely@cluster0.g0xbeuh.mongodb.net/corezip
     NODE_ENV=production
     ```

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your service URL (e.g., `https://core-zip-backend.onrender.com`)

6. **Update Frontend URLs**:
   - Open `frontend/script.js` and `frontend/admin.js`
   - Update:
     ```javascript
     const API_BASE_URL = "https://core-zip-backend.onrender.com/api";
     ```
   - Commit and push to GitHub:
     ```powershell
     git add frontend/script.js frontend/admin.js
     git commit -m "Update API URL for production"
     git push
     ```

---

## Frontend Deployment

### Option 1: GitHub Pages (Static Files)

1. **Push frontend to `gh-pages` branch**:
   ```powershell
   git subtree push --prefix frontend origin gh-pages
   ```

2. **Enable GitHub Pages**:
   - Go to https://github.com/lilmolily/nestle/settings/pages
   - Select `gh-pages` branch
   - Your site will be available at `https://lilmolily.github.io/nestle`

### Option 2: Render (Recommended)

1. **Create another Render service for frontend**:
   - Click "New +" → "Static Site"
   - Connect GitHub repository
   - **Build Command**: Leave empty (if just serving static files)
   - **Publish Directory**: `frontend`

2. **Your frontend URL**: `https://core-zip-frontend.onrender.com`

### Option 3: Netlify

1. **Connect GitHub**:
   - Go to https://netlify.com
   - Click "New site from Git"
   - Connect GitHub repository
   - **Build Command**: Leave empty
   - **Publish Directory**: `frontend`

---

## MongoDB Setup

Your MongoDB connection string is ready:
```
mongodb+srv://franconicelyjane:nicely@cluster0.g0xbeuh.mongodb.net/corezip
```

### View Your Data

1. **Go to [MongoDB Atlas](https://cloud.mongodb.com)**
2. **Login** with your account
3. **Select Cluster0**
4. **Click "Browse Collections"**
5. **View databases**:
   - `corezip` (your main database)
   - Collections:
     - `products` - All products added via admin
     - `orders` - All customer orders

### Database Backups

MongoDB Atlas automatically backs up your data. You can:
- View backups in "Backup" section
- Download backups for safekeeping
- Restore if needed

---

## API Endpoints (Production)

Replace `http://localhost:5000` with your Render URL in production.

### Products
```
GET    https://your-backend.onrender.com/api/products
GET    https://your-backend.onrender.com/api/products/:id
POST   https://your-backend.onrender.com/api/products
PUT    https://your-backend.onrender.com/api/products/:id
DELETE https://your-backend.onrender.com/api/products/:id
```

### Orders
```
GET    https://your-backend.onrender.com/api/orders
GET    https://your-backend.onrender.com/api/orders/:id
POST   https://your-backend.onrender.com/api/orders
PUT    https://your-backend.onrender.com/api/orders/:id
DELETE https://your-backend.onrender.com/api/orders/:id
```

---

## Troubleshooting

### "Git command not found"
- Install Git: https://git-scm.com/download/win
- Restart PowerShell after installation

### "Backend can't connect to MongoDB"
- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas whitelist includes your IP (should be 0.0.0.0/0 for testing)
- Check network connectivity

### "Frontend can't reach backend API"
- Verify `API_BASE_URL` is correct in `script.js` and `admin.js`
- Check browser console for CORS errors
- Backend should have `cors` middleware enabled (it does)

### Render deployment fails
- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure `package.json` has correct scripts

---

## Success Checklist

- [ ] GitHub repository created and pushed
- [ ] Backend deployed to Render
- [ ] MongoDB Atlas database verified
- [ ] Frontend API URLs updated to production
- [ ] Frontend deployed (GitHub Pages or Render)
- [ ] Test admin panel: Login and add a product
- [ ] Test checkout: Add item to cart and place order
- [ ] Verify order appears in MongoDB Atlas
- [ ] Check Render logs for any errors

---

## Next Steps

1. Share your live URL with users
2. Monitor Render logs for errors
3. Scale up Render instance if needed
4. Set up custom domain (optional)
5. Enable HTTPS (automatic on Render)

---

For support or questions, refer to:
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Help](https://docs.mongodb.com/manual)
- [Express.js Guide](https://expressjs.com)
