import express from "express";
import {
  registercontroller,
  logincontroller,
  logoutController,
  testcontroller,
  forgotpasswordController,
  isAdmin,
} from "../controller/authcontroller.js";
import { requireSignIn } from "../middlewares/authmiddleware.js";

const router = express.Router();

//register
router.post("/register", registercontroller);

//login
router.post("/login", logincontroller);

//logout
router.post("/logout", logoutController);

//test controller
router.get("/test", requireSignIn, isAdmin, testcontroller);

//forgot password
router.post("/forgot-password", forgotpasswordController);

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
export default router;
