import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";
import { createCategoryController } from "./../controller/categorycontroller.js";
import { updateCategoryController } from "./../controller/categorycontroller.js";

const router = express.Router();

//routes
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

export default router;
