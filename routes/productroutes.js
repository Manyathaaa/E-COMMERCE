import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";
import {
  createProductController,
  getAllProductController,
  getsingleproductController,
  productPhotoController,
  deleteproductController,
  updateProductController,
} from "../controller/productcontroller.js";
import expressformidable from "express-formidable";

const router = express.Router();

//router
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  expressformidable(),
  createProductController
);

router.get("/get-product", getAllProductController);

//single get
router.get("/get-product/:slug", getsingleproductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete prduct
router.delete("/delete-product/:pid", deleteproductController);

//update
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  expressformidable(),
  updateProductController
);
export default router;
