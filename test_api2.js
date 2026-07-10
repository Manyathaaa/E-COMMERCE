import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });

import Order from './models/orderModel.js';
import Product from './models/productModels.js';
import User from './models/userModels.js';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const adminUser = await User.findOne({ role: 1 });
    
    // Simulate user orders query
    const userOrders = await Order.find({ user: adminUser._id })
      .populate("products.product", "name photo")
      .sort({ createdAt: -1 });
    console.log("User orders fetched:", userOrders.length);

    // Simulate admin orders query
    const allOrders = await Order.find({})
      .populate("products.product", "name photo")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    console.log("Admin orders fetched:", allOrders.length);

  } catch (error) {
    console.log("Error during query:", error.message);
    console.log(error.stack);
  }
  process.exit(0);
};
run();
