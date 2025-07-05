import usermodel from "../models/usermodel.js";
import { hashPassword } from "./../helpers/authhelper.js";

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

    return res.send(201).send({
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
