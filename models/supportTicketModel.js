import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "order-issue",
        "payment-issue",
        "product-inquiry",
        "shipping-issue",
        "return-refund",
        "account-issue",
        "technical-support",
        "general-inquiry",
        "complaint",
        "suggestion",
      ],
      default: "general-inquiry",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "waiting-response", "resolved", "closed"],
      default: "open",
    },
    description: {
      type: String,
      required: true,
    },
    orderId: {
      type: mongoose.ObjectId,
      ref: "Order",
    },
    attachments: [
      {
        filename: String,
        originalName: String,
        path: String,
        size: Number,
        mimetype: String,
      },
    ],
    messages: [
      {
        sender: {
          type: String,
          enum: ["user", "support"],
          required: true,
        },
        senderName: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        attachments: [
          {
            filename: String,
            originalName: String,
            path: String,
            size: Number,
            mimetype: String,
          },
        ],
      },
    ],
    assignedTo: {
      type: mongoose.ObjectId,
      ref: "User", // Support staff
    },
    resolution: {
      summary: String,
      resolvedBy: {
        type: mongoose.ObjectId,
        ref: "User",
      },
      resolvedAt: Date,
    },
    customerSatisfaction: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      feedback: String,
      submittedAt: Date,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
supportTicketSchema.index({ user: 1, status: 1 });
supportTicketSchema.index({ status: 1, priority: 1 });
supportTicketSchema.index({ category: 1 });
supportTicketSchema.index({ createdAt: -1 });

export default mongoose.model("SupportTicket", supportTicketSchema);
