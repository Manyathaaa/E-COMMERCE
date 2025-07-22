import productModels from "../models/productModels.js";
import fs from "fs";
import slugify from "slugify";

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields || req.body;
    const { photo } = req.files; // ✅ photo comes from req.files

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
export const getAllProductController = async (req, res) => {
  try {
    const products = await productModels
      .find({})
      .populate("category") // only if product model has 'category'
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      totalCount: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error); // check console for further error
    res.status(500).send({
      success: false,
      message: "Error while getting products",
      error,
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
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModels
      .findById(req.params.pid)
      .select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.ContentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log("error", error);
    return res.status(404).send({
      success: false,
      message: "something wrong in getting photo",
    });
  }
};
