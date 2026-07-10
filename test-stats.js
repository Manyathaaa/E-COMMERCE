import mongoose from "mongoose";
import dotenv from "dotenv";
import orderModel from "./models/orderModel.js";
dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(async () => {
    const totalOrders = await orderModel.countDocuments();
    console.log("Total Orders:", totalOrders);
    const revenueResult = await orderModel.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$orderSummary.total" } } }
    ]);
    console.log("Revenue:", revenueResult);
    const orderStatusResult = await orderModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    console.log("Status:", orderStatusResult);
    process.exit(0);
});
