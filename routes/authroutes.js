import express from "express";
import { registercontroller } from "../controller/authcontroller.js";

const router = express.Router();

//register
router.post("\register", registercontroller);
export default router;
