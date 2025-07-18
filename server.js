import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authrouter from "./routes/authroutes.js";
import cors from "cors";
import categoryroute from "./routes/categoryroute.js";
import productroute from "./routes/productroutes.js";
import formidable from "express-formidable";

// env config
dotenv.config();

// connect database
connectDB();

const app = express();

// Middleware
app.use(formidable());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/auth", authrouter);
app.use("/api/v1/category", categoryroute);
app.use("/api/v1/products", productroute);

// Home route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Ecommerce App</h1>");
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
