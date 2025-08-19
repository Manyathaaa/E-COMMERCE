import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.ObjectId,
          ref: "product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: "India",
      },
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "upi", "wallet"],
      required: true,
    },
    paymentDetails: {
      cardLast4: String,
      upiId: String,
      transactionId: String,
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
    },
    orderSummary: {
      subtotal: {
        type: Number,
        required: true,
      },
      shipping: {
        type: Number,
        default: 0,
      },
      tax: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out-for-delivery",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
        updatedBy: {
          type: mongoose.ObjectId,
          ref: "User",
        },
      },
    ],
    tracking: {
      trackingNumber: String,
      carrier: String,
      estimatedDelivery: Date,
      actualDelivery: Date,
    },
    notes: {
      customerNote: String,
      adminNote: String,
    },
    cancellation: {
      reason: String,
      cancelledAt: Date,
      cancelledBy: {
        type: mongoose.ObjectId,
        ref: "User",
      },
      refundAmount: Number,
      refundStatus: {
        type: String,
        enum: ["pending", "processed", "completed"],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "paymentDetails.paymentStatus": 1 });

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(
      4,
      "0"
    )}`;
  }
  next();
});

// Add status to history when status changes
orderSchema.pre("save", function (next) {
  if (this.isModified("status") && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: `Status changed to ${this.status}`,
    });
  }
  next();
});

// Virtual for order age
orderSchema.virtual("orderAge").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for total items
orderSchema.virtual("totalItems").get(function () {
  return this.products.reduce((total, product) => total + product.quantity, 0);
});

export default mongoose.model("Order", orderSchema);
