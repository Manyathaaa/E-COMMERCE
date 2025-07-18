import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";
import { createProductController } from "../controller/productcontroller.js";
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

export default router;
