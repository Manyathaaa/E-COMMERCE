import express from "express";

const app = express();
//for api

app.get("/", (req, res) => {
  res.send("<h1>welcome to ecommerce app </h1>");
});

//port
const PORT = 1111;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
