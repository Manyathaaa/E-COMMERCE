import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";
import {
  createProductController,
  getAllProductController,
  getsingleproductController,
  productPhotoController,
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
export default router;
