import express from "express";
import {
  createOrderController,
  getUserOrdersController,
  getOrderController,
  updateOrderStatusController,
  cancelOrderController,
  getAllOrdersController,
  getOrderStatsController,
} from "../controller/orderController.js";
import { requireSignIn, isAdmin } from "../middlewares/authmiddleware.js";

const router = express.Router();

// User routes
router.post("/create", requireSignIn, createOrderController);
router.get("/user-orders", requireSignIn, getUserOrdersController);
router.get("/:orderId", requireSignIn, getOrderController);
router.put("/:orderId/cancel", requireSignIn, cancelOrderController);

// Admin routes
router.get("/admin/all-orders", requireSignIn, isAdmin, getAllOrdersController);
router.put("/admin/:orderId/status", requireSignIn, isAdmin, updateOrderStatusController);
router.get("/admin/stats", requireSignIn, isAdmin, getOrderStatsController);

export default router;
