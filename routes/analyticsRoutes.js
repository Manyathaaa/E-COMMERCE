import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";
import { getAdminDashboardStatsController } from "../controller/analyticsController.js";

const router = express.Router();

// GET admin dashboard stats
router.get("/dashboard-stats", requireSignIn, isAdmin, getAdminDashboardStatsController);

export default router;
