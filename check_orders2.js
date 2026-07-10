import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });

import Order from "./models/orderModel.js";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  try {
    const orders = await Order.find({})
      .populate("products.product", "name photo")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    console.log("Orders retrieved:", orders.length);
  } catch (error) {
    console.log("Error:", error);
  }
  process.exit(0);
};
run();
