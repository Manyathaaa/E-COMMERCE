import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });

const orderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.model("Order", orderSchema, "orders");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  const orders = await Order.find({});
  console.log(JSON.stringify(orders, null, 2));
  process.exit(0);
};
run();
