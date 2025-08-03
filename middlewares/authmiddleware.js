// middleware/authmiddleware.js
import JWT from "jsonwebtoken";
import userModel from "../models/usermodel.js";

// Middleware to verify token
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .send({ success: false, message: "No token provided" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }
};

// Middleware to check if user is an admin
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user || user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Access denied: Admins only",
      });
    }
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).send({
      success: false,
      message: "Server error in admin check",
    });
  }
};
