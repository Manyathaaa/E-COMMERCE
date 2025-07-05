import express from "express";
import {
  registercontroller,
  logincontroller,
  testcontroller,
  isAdmin,
} from "../controller/authcontroller.js";
import { requireSignIn } from "../middlewares/authmiddleware.js";

const router = express.Router();

//register
router.post("/register", registercontroller);

//login
router.post("/login", logincontroller);

//test controller
router.get("/test", requireSignIn, isAdmin, testcontroller);
export default router;
