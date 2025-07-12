import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authrouter from "./routes/authroutes.js";
import cors from "cors";

//env config
dotenv.config();

//database config
connectDB();

const app = express();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000", // your React app origin
    credentials: true, // 👈 allow cookies to be sent
  })
);

//routes
app.use("/api/v1/auth", authrouter);

//for api

app.get("/", (req, res) => {
  res.send("<h1>welcome to ecommerce app </h1>");
});

//port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
