import SupportTicket from "../models/supportTicketModel.js";
import User from "../models/usermodel.js";
import {
  sendSupportTicketConfirmationEmail,
  sendSupportTicketResponseEmail,
} from "../helpers/emailHelper.js";

// Create new support ticket
export const createSupportTicketController = async (req, res) => {
  try {
    const { subject, category, priority, description, orderId, tags } =
      req.body;

    // Debug logging
    console.log("User from req:", req.user);
    console.log("Request body:", req.body);

    // Validation
    if (!subject || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Subject, description, and category are required",
      });
    }

    // Check if user is authenticated
    if (!req.user || !req.user._id || !req.user.name) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // Create initial message
    const initialMessage = {
      sender: "user",
      senderName: req.user.name,
      message: description,
      timestamp: new Date(),
    };

    console.log("Initial message:", initialMessage);

    // Generate ticket number
    const ticketCount = await SupportTicket.countDocuments();
    const ticketNumber = `TKT-${Date.now()}-${String(ticketCount + 1).padStart(
      4,
      "0"
    )}`;

    // Create support ticket
    const ticket = new SupportTicket({
      user: req.user._id,
      ticketNumber,
      subject,
      category,
      priority: priority || "medium",
      description,
      orderId: orderId || undefined,
      tags: tags || [],
      messages: [initialMessage],
    });

    console.log("Ticket before save:", ticket);

    await ticket.save();

    // Populate user details
    await ticket.populate("user", "name email");
    if (orderId) {
      await ticket.populate("orderId", "orderNumber");
    }

    // Send confirmation email
    try {
      await sendSupportTicketConfirmationEmail(ticket, req.user);
    } catch (emailError) {
      console.log("Email notification failed:", emailError.message);
      // Continue with response even if email fails
    }

    res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.log("Support ticket creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating support ticket",
      error: error.message,
    });
  }
};

// Get user's support tickets
export const getUserSupportTicketsController = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;

    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const tickets = await SupportTicket.find(filter)
      .populate("user", "name email")
      .populate("orderId", "orderNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalTickets = await SupportTicket.countDocuments(filter);

    res.status(200).json({
      success: true,
      tickets,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTickets / limit),
        totalTickets,
        hasNext: page * limit < totalTickets,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.log("Error fetching support tickets:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching support tickets",
      error: error.message,
    });
  }
};

// Get single support ticket
export const getSupportTicketController = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await SupportTicket.findById(ticketId)
      .populate("user", "name email phone")
      .populate("orderId", "orderNumber status createdAt")
      .populate("assignedTo", "name email")
      .populate("resolution.resolvedBy", "name email");

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    // Check if user owns this ticket or is admin
    if (
      ticket.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 1
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.log("Error fetching support ticket:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching support ticket",
      error: error.message,
    });
  }
};

// Add message to support ticket
export const addMessageToTicketController = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const ticket = await SupportTicket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    // Check if user owns this ticket
    if (ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Add new message
    const newMessage = {
      sender: "user",
      senderName: req.user.name,
      message: message.trim(),
      timestamp: new Date(),
    };

    ticket.messages.push(newMessage);

    // Update status if ticket was resolved
    if (ticket.status === "resolved" || ticket.status === "closed") {
      ticket.status = "waiting-response";
    }

    await ticket.save();

    // Populate the ticket for response
    await ticket.populate("user", "name email");
    await ticket.populate("orderId", "orderNumber");

    // Send email notification for new message
    try {
      await sendSupportTicketResponseEmail(
        ticket,
        req.user,
        newMessage.message
      );
    } catch (emailError) {
      console.log("Email notification failed:", emailError.message);
      // Continue with response even if email fails
    }

    res.status(200).json({
      success: true,
      message: "Message added successfully",
      ticket,
    });
  } catch (error) {
    console.log("Error adding message to ticket:", error);
    res.status(500).json({
      success: false,
      message: "Error adding message",
      error: error.message,
    });
  }
};

// Close support ticket
export const closeSupportTicketController = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { rating, feedback } = req.body;

    const ticket = await SupportTicket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    // Check if user owns this ticket
    if (ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Check if ticket can be closed
    if (ticket.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Ticket is already closed",
      });
    }

    // Update ticket status and satisfaction
    ticket.status = "closed";

    if (rating) {
      ticket.customerSatisfaction = {
        rating: parseInt(rating),
        feedback: feedback || "",
        submittedAt: new Date(),
      };
    }

    await ticket.save();

    res.status(200).json({
      success: true,
      message: "Support ticket closed successfully",
      ticket,
    });
  } catch (error) {
    console.log("Error closing support ticket:", error);
    res.status(500).json({
      success: false,
      message: "Error closing support ticket",
      error: error.message,
    });
  }
};

// Admin: Get all support tickets
export const getAllSupportTicketsController = async (req, res) => {
  try {
    const {
      status,
      category,
      priority,
      assignedTo,
      page = 1,
      limit = 20,
      search,
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    if (search) {
      filter.$or = [
        { ticketNumber: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const tickets = await SupportTicket.find(filter)
      .populate("user", "name email phone")
      .populate("orderId", "orderNumber")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalTickets = await SupportTicket.countDocuments(filter);

    // Get statistics
    const stats = await SupportTicket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      tickets,
      stats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTickets / limit),
        totalTickets,
        hasNext: page * limit < totalTickets,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.log("Error fetching support tickets:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching support tickets",
      error: error.message,
    });
  }
};

// Admin: Update ticket status and assignment
export const updateSupportTicketController = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, assignedTo, priority, tags } = req.body;

    const ticket = await SupportTicket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    // Update fields
    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (priority) ticket.priority = priority;
    if (tags) ticket.tags = tags;

    await ticket.save();

    // Populate for response
    await ticket.populate("user", "name email");
    await ticket.populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      message: "Support ticket updated successfully",
      ticket,
    });
  } catch (error) {
    console.log("Error updating support ticket:", error);
    res.status(500).json({
      success: false,
      message: "Error updating support ticket",
      error: error.message,
    });
  }
};

// Admin: Add support response
export const addSupportResponseController = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message, status } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const ticket = await SupportTicket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    // Add support response
    const supportMessage = {
      sender: "support",
      senderName: req.user.name,
      message: message.trim(),
      timestamp: new Date(),
    };

    ticket.messages.push(supportMessage);

    // Update status if provided
    if (status) {
      ticket.status = status;
    } else if (ticket.status === "open") {
      ticket.status = "in-progress";
    }

    // Set assigned to current support user if not already assigned
    if (!ticket.assignedTo) {
      ticket.assignedTo = req.user._id;
    }

    await ticket.save();

    // Populate for response
    await ticket.populate("user", "name email");
    await ticket.populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      message: "Support response added successfully",
      ticket,
    });
  } catch (error) {
    console.log("Error adding support response:", error);
    res.status(500).json({
      success: false,
      message: "Error adding support response",
      error: error.message,
    });
  }
};
