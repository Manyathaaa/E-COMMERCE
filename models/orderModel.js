import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
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
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: "India" },
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "upi", "wallet"],
      required: true,
    },
    paymentDetails: {
      transactionId: String,
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
    },
    orderSummary: {
      subtotal: Number,
      shipping: { type: Number, default: 0 },
      tax: Number,
      discount: { type: Number, default: 0 },
      total: Number,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    notes: {
      customerNote: String,
    },
  },
  {
    timestamps: true,
  }
);

// // Generate order number before saving
// orderSchema.pre("save", async function (next) {
//   if (this.isNew && !this.orderNumber) {
//     const count = await mongoose.model("Order").countDocuments();
//     this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(
//       4,
//       "0"
//     )}`;
//   }
//   next();
// });

export default mongoose.model("Order", orderSchema);
