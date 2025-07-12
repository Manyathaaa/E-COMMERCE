import usermodel from "../models/usermodel.js";
import { comparepassword, hashPassword } from "./../helpers/authhelper.js";
import JWT from "jsonwebtoken";

// Register Controller
export const registercontroller = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).send({
        success: false,
        message: "fill all the requirements",
      });
    }

    // Existing user
    const existing = await usermodel.findOne({ email });
    if (existing) {
      return res.status(200).send({
        success: false,
        message: "already registered please login",
      });
    }

    // Hash password and register user
    const hashedPassword = await hashPassword(password);
    const user = await new usermodel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();

    //
    return res.status(201).send({
      success: true,
      message: "registered successfully",
      user,
    });
  } catch (error) {
    console.log("register error:", error);
    return res.status(500).send({
      success: false,
      message: "error to register",
      error,
    });
  }
};

// Login Controller
export const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "invalid email or password",
      });
    }

    // Check user
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "email is not registered",
      });
    }

    const match = await comparepassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "invalid password",
      });
    }

    const token = JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(200).send({
      success: true,
      message: "successful login",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log("login error:", error);
    return res.status(500).send({
      success: false,
      message: "failure to login",
      error,
    });
  }
};

// Test Controller
export const testcontroller = (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      message: "protected route",
      user: req.user,
    });
  } catch (error) {
    console.log("testcontroller error:", error);
    return res.status(500).send({
      success: false,
      message: "error in testcontroller",
      error,
    });
  }
};

// Admin Access Middleware
export const isAdmin = async (req, res, next) => {
  try {
    console.log("Decoded user in isAdmin:", req.user);
    if (req.user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "unauthorized access",
      });
    }
    next();
  } catch (error) {
    console.log("isAdmin error:", error);
    res.status(401).send({
      success: false,
      error,
      message: "error in admin middleware",
    });
  }
};
