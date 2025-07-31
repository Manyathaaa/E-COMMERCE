import productModels from "../models/productModels.js";
import fs from "fs";
import slugify from "slugify";

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields || req.body;
    const { photo } = req.files; // photo comes from req.files

    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "photo should be less than 1MB" });
    }

    const productData = req.fields || req.body;
    const product = new productModels({ ...productData, slug: slugify(name) });

    if (photo) {
      product.photo = {
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      };
    }

    await product.save(); // use save not bulkSave

    return res.status(200).send({
      success: true,
      message: "product created successfully",
      product,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send({
      success: false,
      message: "something went wrong in creating product",
      error: error.message || error,
    });
  }
};

// GET all products
// controllers/productController.js
export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModels.find({}).select("-photo"); // exclude photo
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error getting products",
    });
  }
};

//single get Controller
export const getsingleproductController = async (req, res) => {
  try {
    const product = await productModels
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "single product fetched",
      product,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(404).send({
      success: false,
      message: "something wrong in getting single product",
    });
  }
};

//get photo
export const getproductPhotoController = async (req, res) => {
  try {
    const product = await productModels
      .findById(req.params.pid)
      .select("photo");
    if (product && product.photo && product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    } else {
      return res.status(404).send({
        success: false,
        message: "Photo not found",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(404).send({
      success: false,
      message: "something wrong in getting photo",
    });
  }
};

//delete product
export const deleteproductController = async (req, res) => {
  try {
    await productModels.findByIdAndDelete(req.params.pid).select("photo");
    return res.status(200).send({
      success: true,
      message: "deleted successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(404).send({
      success: true,
      message: "aomething wrong in deleting product",
    });
  }
};

//update product
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields || req.body;
    const { photo } = req.files; //  photo comes from req.files

    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "photo should be less than 1MB" });
    }

    const product = await productModels.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo = {
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      };
    }

    await product.save(); // use save not bulkSave

    return res.status(201).json({
      success: true,
      message: "product updated successfully",
      product,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(404).send({
      success: false,
      message: "something wrong in update",
    });
  }
};

// FILTER PRODUCTS BY CATEGORY AND PRICE
export const productFiltersController = async (req, res) => {
  try {
    const { checked, selectedPrice } = req.body || req.fields;
    let args = {};

    if (checked?.length > 0) {
      args.category = { $in: checked };
    }

    if (selectedPrice?.length === 2) {
      args.price = {
        $gte: selectedPrice[0],
        $lte: selectedPrice[1],
      };
    }

    const products = await productModels.find(args).select("-photo");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).send({
      success: false,
      message: "Error filtering products",
      error,
    });
  }
};

//productCountController

export const productCountController = async (req, res) => {
  try {
    const total = await productModels.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).send({
      message: "error in product count",
      error,
      success: false,
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModels
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
    });
  }
};
