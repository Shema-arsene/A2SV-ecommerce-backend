### **E-commerce Backend API**

A comprehensive REST API for an e-commerce platform built with Node.js, Express, TypeScript, and MongoDB for the A2SV technical interview - done by Niyonkuru Shema Arsene | niyonkurushemaa@gmail.com.

It supports user authentication, product management, and order processing with robust validation and role-based access control.

## Features

- **User Authentication (JWT)** - Secure login & registration for users and admins.
- **Role-based Authorization** – Admin-only access for product management.
- **Product Management** - CRUD operations for products (Admin only).
- **Order Management System** - Users can place orders, view their order history, and see their order(s) details. Enhanced with stock validation and transactions to ensure consistency during order creation.
- **Search & Pagination** - Product search & order history with paginated results.
- **TypeScript + Mongoose** – Strong typing and schema-based data modeling.

## Technology Stack

- **TypeScript** - Type safety and better development experience.
- **Node.js + Express** - Runtime and web framework.
- **MongoDB** - NoSQL database for flexible data storage.
- **Mongoose** - MongoDB object modeling.
- **JWT** - JSON Web Tokens for authentication.
- **bcryptjs** - Password hashing.
- **Dotenv** - Environment variable management

## Technology Choices & Rationale

- **TypeScript**: Chosen for type safety, better developer experience, and easier maintenance of a large codebase.
- **Node.js + Express**: Selected for fast setup, excellent REST API capabilities, and extensive ecosystem.
- **MongoDB**: Ideal for e-commerce due to flexible schema and JSON-like document structure.
- **JWT**: Provides stateless, scalable authentication perfect for distributed systems.
- **Mongoose**: Offers robust data validation, middleware, and TypeScript support.

## Installation & Setup

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account

1. **Clone The repository**

```bash
git clone https://github.com/Shema-arsene/A2SV-ecommerce-backend
cd A2SV-ecommerce-backend
```

2. **Install the dependencies**

```bash
npm install
```

3. **Setup environment variables**
   Create an .env file in the root directory and add:

```bash
MONGODB_URI=mongodb+srv://<your-db-uri>
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. **Admin User Setup**

npx node --loader ts-node/esm src/scripts/createAdmin.ts

5. **Run in development mode**

```bash
npm run dev
```

6. **Build for production**

```bash
npm run build
```

7. **Run development server**

```bash
npm start
```

## **Project Structure**

A2SV-ecommerce-backend/
│
├── src/
│ ├── config/
│ │ └── db.ts
│ ├── controllers/
│ │ ├── authController.ts
│ │ ├── orderController.ts
│ │ └── productController.ts
│ │
│ ├── middleware/
│ │ └── auth.ts
│ │
│ ├── models/
│ │ ├── Order.ts
│ │ ├── Product.ts
│ │ └── User.ts
│ │
│ ├── routes/
│ │ ├── authRoutes.ts
│ │ ├── orderRoutes.ts
│ │ └── productRoutes.ts
│ │
│ ├── scripts/
│ │ └── createAdmin.ts
| |
│ ├── utils/
│ │ └── generateToken.ts
│ │
│ └── app.ts
│
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── ts-node.json
└── tsconfig.json

## API Endpoints

## Authentication

POST /api/auth/register - User registration
POST /api/auth/login - User login

## Products

GET /api/products - Get all products (public, with search & pagination)
GET /api/products/:id - Get product by ID (public)
POST /api/products - Create product (admin only)
PUT /api/products/:id - Update product (admin only)
DELETE /api/products/:id - Delete product (admin only)

## Orders

POST /api/orders - Place new order (authenticated users)
GET /api/orders - Get order history (authenticated users)

## Database Models

User - Authentication and role management
Product - Product catalog with inventory
Order - Order processing with transaction safety

## Example order Object

```json
{
  "user": "67413b62a67830e9f5f847ef",
  "items": [
    {
      "product": "67413c70a67830e9f5f847f4",
      "quantity": 2,
      "price": 150
    }
  ],
  "totalPrice": 300,
  "status": "pending",
  "description": "Order for electronics"
}
```

## Example Product Object

```json
{
  "_id": "67413c70a67830e9f5f847f4",
  "name": "Wireless Headphones",
  "description": "Noise-cancelling over-ear headphones",
  "price": 150,
  "stock": 12,
  "category": "Electronics"
}
```

## Development Tools

Nodemon for auto-restart
ts-node for TypeScript runtime execution

## Future Enhancements

Add product image upload (Cloudinary or AWS S3)
Add admin dashboard
Integrate payment gateway (Stripe/PayPal)
Add order status notifications via email
