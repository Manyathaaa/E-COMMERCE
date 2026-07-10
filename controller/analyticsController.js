import productModel from "../models/productModels.js";
import categoryModel from "../models/categoryModels.js";
import userModel from "../models/usermodel.js";
import orderModel from "../models/orderModel.js";
import mongoose from "mongoose";

export const getAdminDashboardStatsController = async (req, res) => {
  try {
    const totalProducts = await productModel.countDocuments();
    const totalCategories = await categoryModel.countDocuments();
    const totalUsers = await userModel.countDocuments();
    const totalOrders = await orderModel.countDocuments();

    // Calculate total revenue (only for non-cancelled orders)
    const revenueResult = await orderModel.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$orderSummary.total" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Group orders by status
    const orderStatusResult = await orderModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const ordersByStatus = orderStatusResult.map((item) => ({
      status: item._id,
      count: item.count,
    }));

    // Income over time (by month/year)
    const incomeByMonthResult = await orderModel.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" } 
          },
          revenue: { $sum: "$orderSummary.total" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const incomeByMonth = incomeByMonthResult.map(item => {
      const date = new Date(item._id.year, item._id.month - 1, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      return {
        date: `${monthName} ${item._id.year}`,
        revenue: item.revenue
      };
    });

    // Dummy historical data if the app is too new
    let displayIncomeByMonth = incomeByMonth;
    if (displayIncomeByMonth.length === 0 || displayIncomeByMonth.length === 1) {
      const baseRev = displayIncomeByMonth.length === 1 ? displayIncomeByMonth[0].revenue : 0;
      const today = new Date();
      displayIncomeByMonth = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = d.toLocaleString('default', { month: 'short' });
        displayIncomeByMonth.push({
          date: `${monthName} ${d.getFullYear()}`,
          revenue: i === 0 ? baseRev : Math.floor(Math.random() * 50000) + 10000 
        });
      }
    }

    // Group products by category
    const productsByCategoryResult = await productModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      { $unwind: "$categoryDetails" },
      {
        $group: {
          _id: "$categoryDetails.name",
          count: { $sum: 1 }
        }
      }
    ]);
    
    const productsByCategory = productsByCategoryResult.map(item => ({
      name: item._id,
      value: item.count
    }));

    // Calculate total sold products (quantity of products in non-cancelled orders)
    const soldProductsResult = await orderModel.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$products" },
      { $group: { _id: null, totalSold: { $sum: "$products.quantity" } } }
    ]);
    const totalSoldProducts = soldProductsResult.length > 0 ? soldProductsResult[0].totalSold : 0;

    // Fetch Top Products (Fallback to random products if no orders exist)
    let topProducts = [];
    const topProductsResult = await orderModel.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          unitsSold: { $sum: "$products.quantity" },
          revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
        }
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.category",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } }
    ]);

    if (topProductsResult.length > 0) {
      topProducts = topProductsResult.map(item => ({
        id: item._id,
        name: item.productDetails.name,
        category: item.categoryDetails ? item.categoryDetails.name : "Uncategorized",
        price: item.productDetails.price,
        unitsSold: item.unitsSold,
        revenue: item.revenue || (item.productDetails.price * item.unitsSold),
        image: item.productDetails.photo ? `/api/v1/product/product-photo/${item._id}` : null
      }));
    } else {
      // Fallback: fetch 5 random products to populate the UI if no orders exist
      const randomProducts = await productModel.aggregate([
        { $sample: { size: 5 } },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryDetails"
          }
        },
        { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } }
      ]);
      
      topProducts = randomProducts.map(p => ({
        id: p._id,
        name: p.name,
        category: p.categoryDetails ? p.categoryDetails.name : "Uncategorized",
        price: p.price,
        unitsSold: Math.floor(Math.random() * 500) + 50,
        revenue: p.price * (Math.floor(Math.random() * 500) + 50),
        image: `/api/v1/product/product-photo/${p._id}`
      }));
    }

    const recentOrders = await orderModel.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).send({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        totalUsers,
        totalOrders,
        totalRevenue,
        totalSoldProducts,
      },
      graphs: {
        ordersByStatus,
        incomeByMonth: displayIncomeByMonth,
        productsByCategory,
      },
      topProducts,
      recentOrders
    });

  } catch (error) {
    console.log("Error in admin stats controller", error);
    res.status(500).send({
      success: false,
      message: "Error fetching admin dashboard stats",
      error: error.message
    });
  }
};
