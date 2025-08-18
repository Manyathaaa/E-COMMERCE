import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authmiddleware.js";
import {
  getUserProfileController,
  updateProfileController,
  changePasswordController,
  getUserStatsController,
  deleteAccountController,
  getAllUsersController,
  getSingleUserController,
  updateUserStatusController,
  searchUsersController,
  verifyUserController,
} from "../controller/userController.js";

const router = express.Router();

// User Profile Routes (Protected)
router.get("/profile", requireSignIn, getUserProfileController);
router.put("/profile", requireSignIn, updateProfileController);
router.put("/change-password", requireSignIn, changePasswordController);
router.get("/stats", requireSignIn, getUserStatsController);
router.delete("/delete-account", requireSignIn, deleteAccountController);

// Admin Routes (Protected + Admin Only)
router.get("/admin/users", requireSignIn, isAdmin, getAllUsersController);
router.get(
  "/admin/users/search",
  requireSignIn,
  isAdmin,
  searchUsersController
);
router.get(
  "/admin/users/:userId",
  requireSignIn,
  isAdmin,
  getSingleUserController
);
router.put(
  "/admin/users/:userId/status",
  requireSignIn,
  isAdmin,
  updateUserStatusController
);
router.put(
  "/admin/users/:userId/verify",
  requireSignIn,
  isAdmin,
  verifyUserController
);

export default router;
