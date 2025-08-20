import express from "express";
import {
  createSupportTicketController,
  getUserSupportTicketsController,
  getSupportTicketController,
  addMessageToTicketController,
  closeSupportTicketController,
  getAllSupportTicketsController,
  updateSupportTicketController,
  addSupportResponseController,
} from "../controller/supportController.js";
import { requireSignIn, isAdmin } from "../middlewares/authmiddleware.js";

const router = express.Router();

// User routes
router.post("/create", requireSignIn, createSupportTicketController);
router.get("/user-tickets", requireSignIn, getUserSupportTicketsController);
router.get("/:ticketId", requireSignIn, getSupportTicketController);
router.post("/:ticketId/message", requireSignIn, addMessageToTicketController);
router.put("/:ticketId/close", requireSignIn, closeSupportTicketController);

// Admin routes
router.get(
  "/admin/all-tickets",
  requireSignIn,
  isAdmin,
  getAllSupportTicketsController
);
router.put(
  "/admin/:ticketId/update",
  requireSignIn,
  isAdmin,
  updateSupportTicketController
);
router.post(
  "/admin/:ticketId/response",
  requireSignIn,
  isAdmin,
  addSupportResponseController
);

export default router;
