# Core Zip E-commerce Backend

A Node.js/Express backend for the Core Zip e-commerce platform with MongoDB integration.

## Features

- **Product Management**: Add, edit, delete, and retrieve products
- **Order Management**: Process customer orders with stock management
- **MongoDB Integration**: Persistent data storage
- **RESTful API**: Clean endpoints for frontend integration
- **CORS Support**: Safe cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your MongoDB URI:
```
MONGODB_URI=mongodb+srv://franconicelyjane:nicely@cluster0.g0xbeuh.mongodb.net/corezip
PORT=5000
NODE_ENV=development
```

## Running Locally

Start the server:
```bash
npm start
```

Or with auto-reload (requires nodemon):
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order (checkout)
- `PUT /api/orders/:id` - Update order status (admin)
- `DELETE /api/orders/:id` - Delete order (admin)

## Deploying to Render

1. **Push your code to GitHub**
   - Create a repository on GitHub
   - Push the nestle project to the repo

2. **Create a Render Web Service**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing this backend

3. **Configure the Service**
   - Name: `core-zip-backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free

4. **Add Environment Variables**
   - Click "Environment" in the Render dashboard
   - Add the following variables:
     ```
     MONGODB_URI=mongodb+srv://franconicelyjane:nicely@cluster0.g0xbeuh.mongodb.net/corezip
     NODE_ENV=production
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy when you push changes to GitHub

6. **Update Frontend**
   - Once deployed, update the API_BASE_URL in `frontend/script.js` and `frontend/admin.js`:
     ```javascript
     const API_BASE_URL = "https://your-render-app.onrender.com/api";
     ```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

## Database Schema

### Product Model
```javascript
{
  _id: ObjectId,
  name: String,
  price: Number,
  description: String,
  stock: Number,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  customerName: String,
  customerEmail: String,
  customerAddress: String,
  items: [
    {
      productId: ObjectId,
      productName: String,
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: Number,
  status: String, // pending, processing, shipped, delivered, cancelled
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

All endpoints return JSON responses with appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Server Error

## Support

For issues or questions, please check the frontend files or contact support.
