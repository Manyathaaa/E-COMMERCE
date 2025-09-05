# 🚀 E-Commerce Platform (MERN Stack)

Welcome to your full-featured, secure, and scalable e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). This project is designed for modern online shopping experiences, with robust backend APIs, secure authentication, and a beautiful, responsive frontend.

---

## 🌐 Live Demo
- **Backend:** [https://e-commerce-6jik.onrender.com/](https://e-commerce-6jik.onrender.com/)
- **Frontend:** *(Add your deployed frontend URL here)*

---

## 🎯 Key Features

### 🔒 Authentication & Security
- JWT-based login and protected routes for users and admins
- Passwords securely hashed with bcrypt
- Role-based access: admin-only actions protected by middleware
- Environment variables for sensitive config (dotenv)

### 👤 User Management
- Register, login, and manage your profile
- Forgot password and password reset
- (Optional) Email/phone verification for new users

### 🛒 Product & Category Management
- Admins can create, update, and delete products/categories
- RESTful APIs for all product/category operations
- Product search, filtering, and detailed views

### 📦 Orders & Cart
- Add, remove, and update items in your cart
- Place orders and view order history
- Order details, status updates, and cancellation

### 💖 Wishlist & Reviews
- Add products to your wishlist
- (Optional) Write and view product reviews

### 🆘 Support System
- Create support tickets for help or inquiries
- Admin dashboard for ticket management
- Email notifications for ticket updates and order confirmations

### 💻 Responsive Frontend
- Fast React SPA with Bootstrap styling
- Toast notifications for instant feedback
- Axios for seamless API communication

### 🚀 Deployment & DevOps
- Easy environment setup with dotenv
- Hot-reloading backend (nodemon)
- Hosting: Backend on Render, frontend on Vercel (or similar)
- Optimized React build for production

---

## 🛠️ Tech Stack
- **Frontend:** React, Bootstrap, Axios, Toastify
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **DevOps:** dotenv, nodemon, Render, Vercel

---

## 📦 Getting Started

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

## 🔗 API Endpoints
- `/api/v1/auth/*` — Authentication (register, login, password reset, role check)
- `/api/v1/products/*` — Product CRUD and search
- `/api/v1/category/*` — Category CRUD
- `/api/v1/orders/*` — Order management
- `/api/v1/support/*` — Support ticket system
- `/api/v1/user/*` — User profile and actions

---

## 📁 Folder Structure
- `client/` — React frontend
- `controller/` — Express controllers
- `models/` — Mongoose models
- `routes/` — Express route definitions
- `middlewares/` — Auth and role-based middleware
- `helpers/` — Utility functions (email, password hashing)
- `config/` — Database and environment config

---

## 📝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
MIT

---

## 🙌 Screenshots & Demo
Add screenshots or a demo video here to showcase your app’s features and UI.

---

## 💡 Tips for Users
- Use a strong password when registering.
- Admin users have access to product/category management and support dashboard.
- For deployment, update your `.env` files with production credentials.
- For support or questions, create a ticket via the support system!

---

## 📬 Contact
For questions, feedback, or support, please open an issue or contact the project maintainer.