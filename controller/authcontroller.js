import usermodel from "../models/usermodel.js";
import { comparepassword, hashPassword } from "./../helpers/authhelper.js";
import JWT from "jsonwebtoken";

export const registercontroller = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).send({
        success: true,
        message: "fill all the requirements",
      });
    }

    //existing user
    const existing = await usermodel.findOne({ email });
    if (existing) {
      return res.status(200).send({
        success: true,
        message: "already registered please login",
      });
    }

    //hash password and register user
    const hashedPassword = await hashPassword(password);
    const user = await new usermodel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();

    return res.status(201).send({
      success: true,
      message: "registered successfully",
    });
  } catch (error) {
    console.log("error");
    return res.status(404).send({
      success: false,
      message: "error to register",
    });
  }
};

//login
export const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "invalid email or password",
      });
    }

    //check user
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "email is not registered",
      });
    }

    const match = await comparepassword(password, user.password);
    if (!match) {
      return res.status(404).send({
        success: false,
        message: "invalid password",
      });
    }

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).send({
      success: true,
      message: "successfull login",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    console.log("error");
    return res.status(404).send({
      success: false,

      message: "failure to login",
    });
  }
};
