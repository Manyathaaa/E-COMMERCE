import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";
import {
  createProductController,
  getAllProductsController,
  getsingleproductController,
  getproductPhotoController,
  deleteproductController,
  updateProductController,
} from "../controller/productcontroller.js";
import expressformidable from "express-formidable";

const router = express.Router();

// Routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  expressformidable(),
  createProductController
);

router.get("/get-products", getAllProductsController);

router.get("/get-product/:slug", getsingleproductController);

router.get("/product-photo/:pid", getproductPhotoController);

router.delete("/delete-product/:pid", deleteproductController);

router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  expressformidable(),
  updateProductController
);

export default router;
