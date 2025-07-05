import express from "express";
import {
  registercontroller,
  logincontroller,
} from "../controller/authcontroller.js";

const router = express.Router();

//register
router.post("/register", registercontroller);

//login
router.post("/login", logincontroller);
export default router;
