import Order from "../models/orderModel.js";
import Product from "../models/productModels.js";
import User from "../models/usermodel.js";

// Create new order
export const createOrderController = async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      orderSummary,
      customerNote,
    } = req.body;

    // Validate products and calculate totals
    let calculatedSubtotal = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedSubtotal += itemTotal;

      orderProducts.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // Validate order summary
    const tax = Math.round(calculatedSubtotal * 0.18); // 18% GST
    const shipping = calculatedSubtotal > 500 ? 0 : 50;
    const total = calculatedSubtotal + tax + shipping - (orderSummary.discount || 0);

    if (Math.abs(total - orderSummary.total) > 1) {
      return res.status(400).json({
        success: false,
        message: "Order total mismatch",
      });
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      products: orderProducts,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      orderSummary: {
        subtotal: calculatedSubtotal,
        shipping,
        tax,
        discount: orderSummary.discount || 0,
        total,
      },
      notes: {
        customerNote,
      },
      statusHistory: [
        {
          status: "pending",
          timestamp: new Date(),
          note: "Order created",
        },
      ],
    });

    await order.save();

    // Update product quantities
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }

    // Populate order details
    await order.populate([
      {
        path: "user",
        select: "name email phone",
      },
      {
        path: "products.product",
        select: "name photo",
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

// Get user orders
export const getUserOrdersController = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { user: req.user._id };

    if (status && status !== "all") {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate([
        {
          path: "products.product",
          select: "name photo",
        },
      ])
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// Get single order
export const getOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate([
        {
          path: "user",
          select: "name email phone",
        },
        {
          path: "products.product",
          select: "name photo",
        },
        {
          path: "statusHistory.updatedBy",
          select: "name role",
        },
      ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// Update order status (Admin only)
export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note, trackingNumber, carrier, estimatedDelivery } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update status
    order.status = status;

    // Add to status history
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
      updatedBy: req.user._id,
    });

    // Update tracking info if provided
    if (status === "shipped" && (trackingNumber || carrier)) {
      order.tracking = {
        ...order.tracking,
        trackingNumber: trackingNumber || order.tracking.trackingNumber,
        carrier: carrier || order.tracking.carrier,
        estimatedDelivery: estimatedDelivery || order.tracking.estimatedDelivery,
      };
    }

    // Set delivery date if status is delivered
    if (status === "delivered") {
      order.tracking.actualDelivery = new Date();
      order.paymentDetails.paymentStatus = "completed";
    }

    await order.save();

    await order.populate([
      {
        path: "user",
        select: "name email phone",
      },
      {
        path: "products.product",
        select: "name photo",
      },
      {
        path: "statusHistory.updatedBy",
        select: "name role",
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// Cancel order
export const cancelOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Check if order can be cancelled
    if (!["pending", "confirmed", "processing"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    // Update order
    order.status = "cancelled";
    order.cancellation = {
      reason: reason || "Cancelled by customer",
      cancelledAt: new Date(),
      cancelledBy: req.user._id,
    };

    // Add to status history
    order.statusHistory.push({
      status: "cancelled",
      timestamp: new Date(),
      note: `Order cancelled: ${reason || "Cancelled by customer"}`,
      updatedBy: req.user._id,
    });

    await order.save();

    // Restore product quantities
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: item.quantity },
      });
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

// Get all orders (Admin only)
export const getAllOrdersController = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate, search } = req.query;
    const query = {};

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Search by order number or user name
    if (search) {
      const users = await User.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { user: { $in: users.map(u => u._id) } },
      ];
    }

    const orders = await Order.find(query)
      .populate([
        {
          path: "user",
          select: "name email phone",
        },
        {
          path: "products.product",
          select: "name photo",
        },
      ])
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    // Get order statistics
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalValue: { $sum: "$orderSummary.total" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      orders,
      stats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// Get order statistics (Admin only)
export const getOrderStatsController = async (req, res) => {
  try {
    const { period = "week" } = req.query;
    let dateFilter = {};

    // Set date filter based on period
    const now = new Date();
    switch (period) {
      case "today":
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        };
        break;
      case "week":
        dateFilter = {
          $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      case "month":
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
        };
        break;
      case "year":
        dateFilter = {
          $gte: new Date(now.getFullYear(), 0, 1),
        };
        break;
    }

    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$orderSummary.total" },
          averageOrderValue: { $avg: "$orderSummary.total" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    // Get top products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: dateFilter,
          status: { $ne: "cancelled" },
        },
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalSold: { $sum: "$products.quantity" },
          totalRevenue: { $sum: "$products.total" },
          productName: { $first: "$products.name" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
      },
      topProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching order statistics",
      error: error.message,
    });
  }
};
