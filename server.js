import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";

//env config
dotenv.config();

//database config
connectDB();

const app = express();

//middleware
app.use(express.json());
app.use(morgan("dev"));

//for api

app.get("/", (req, res) => {
  res.send("<h1>welcome to ecommerce app </h1>");
});

//port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
// import express from "express";
// const app = express();
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
// app.listen(3000, () => {
//   console.log("Server running on port 3000");
// });
