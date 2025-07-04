import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
//for api

app.get("/", (req, res) => {
  res.send("<h1>welcome to ecommerce app </h1>");
});

//port
const PORT = process.env.PORT || 1010;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
