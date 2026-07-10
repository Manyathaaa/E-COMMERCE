import express from "express";
import productModel from "../models/productModels.js";

const router = express.Router();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
});

export default router;
