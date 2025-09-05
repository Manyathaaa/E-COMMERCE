# E-Commerce Platform (MERN Stack)

A full-featured, secure, and scalable e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). This project demonstrates robust backend APIs, JWT authentication, role-based access, and a modern, responsive frontend.

## Live Demo

- **Backend:** [https://e-commerce-6jik.onrender.com/](https://e-commerce-6jik.onrender.com/)
- **Frontend:** (Add your deployed frontend URL here)

---

## Features

### Authentication & Security
- **JWT-based Authentication:** Secure login and protected routes for users and admins.
- **Password Hashing:** User passwords are hashed using bcrypt for security.
- **Role-Based Access:** Admin-only routes and actions protected by Express middleware.
- **Protected Routes:** Both backend and frontend routes are protected based on authentication and user role.
- **Environment Variables:** Sensitive configuration managed via dotenv.

### User Management
- **Registration & Login:** Users can register and log in securely.
- **Profile Management:** Users can view and update their profile information.
- **Password Reset:** Forgot password functionality with secure token handling.
- **Account Verification:** (If implemented) Email/phone verification for new users.

### Product & Category Management
- **CRUD Operations:** Admins can create, update, and delete products and categories.
- **RESTful APIs:** Well-structured endpoints for all product and category operations.
- **Product Search & Filtering:** Users can search and filter products by category, price, etc.
- **Product Details:** Detailed product pages with images, descriptions, and pricing.

### Order & Cart System
- **Shopping Cart:** Add, remove, and update items in the cart.
- **Order Placement:** Users can place orders and view order history.
- **Order Details:** View detailed information for each order.
- **Order Status:** Admins can update order status (pending, confirmed, delivered, cancelled).
- **Order Cancellation:** Users can cancel orders before delivery.

### Wishlist & Reviews
- **Wishlist:** Users can add products to their wishlist.
- **Product Reviews:** (If implemented) Users can write and view product reviews.

### Support System
- **Support Tickets:** Users can create support tickets for issues or inquiries.
- **Admin Support Dashboard:** Admins can view and respond to support tickets.
- **Email Notifications:** Automated emails for support ticket updates and order confirmations.

### Responsive Frontend
- **React SPA:** Fast, responsive single-page application.
- **Bootstrap Styling:** Modern UI with Bootstrap and custom CSS.
- **Toast Notifications:** User feedback for actions and errors.
- **Axios for API Calls:** Efficient communication with backend APIs.

### Deployment & DevOps
- **Environment Setup:** Managed with dotenv for both frontend and backend.
- **Nodemon:** Hot-reloading for backend development.
- **Hosting:** Backend deployed on Render, frontend on Vercel (or similar).
- **Production Build:** Optimized React build for deployment.

---

## Tech Stack

- **Frontend:** React, Bootstrap, Axios, Toastify
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **DevOps:** dotenv, nodemon, Render, Vercel

---

## Getting Started

### Prerequisites
- Node.js & npm
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ecommerce-mern.git
   cd ecommerce-mern
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   cp .env.example .env   # Add your MongoDB URI, JWT secret, etc.
   npm run server
   ```

3. **Frontend Setup:**
   ```bash
   cd client
   npm install
   npm start
   ```

---

## API Endpoints

- `/api/v1/auth/*` - Authentication (register, login, password reset, role check)
- `/api/v1/products/*` - Product CRUD and search
- `/api/v1/category/*` - Category CRUD
- `/api/v1/orders/*` - Order management
- `/api/v1/support/*` - Support ticket system
- `/api/v1/user/*` - User profile and actions

---

## Folder Structure

- `client/` - React frontend
- `controller/` - Express controllers for all resources
- `models/` - Mongoose models
- `routes/` - Express route definitions
- `middlewares/` - Auth and role-based middleware
- `helpers/` - Utility functions (e.g., email, password hashing)
- `config/` - Database and environment config

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT