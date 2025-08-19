import Order from "../models/orderModel.js";
import Product from "../models/productModels.js";

// Create new order
export const createOrderController = async (req, res) => {
  try {
    console.log("Creating order...");
    console.log("Request body:", req.body);

    const {
      products,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      orderSummary,
      customerNote,
    } = req.body;

    // Basic validation
    if (!products || !shippingAddress || !paymentMethod || !orderSummary) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate and prepare products
    const orderProducts = [];
    let calculatedSubtotal = 0;

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
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

    // Calculate totals
    const tax = Math.round(calculatedSubtotal * 0.18); // 18% GST
    const shipping = calculatedSubtotal > 500 ? 0 : 50;
    const total =
      calculatedSubtotal + tax + shipping - (orderSummary.discount || 0);

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${String(orderCount + 1).padStart(
      4,
      "0"
    )}`;

    console.log("Generated order number:", orderNumber);

    // Create order
    const order = new Order({
      orderNumber,
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
    });

    console.log("Saving order...");
    await order.save();
    console.log("Order saved successfully:", order.orderNumber);

    // Update product quantities
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.log("Order creation error:", error);
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
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name photo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
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
      .populate("user", "name email")
      .populate("products.product", "name photo");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 1
    ) {
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
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    // Update order status
    order.status = "cancelled";
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
