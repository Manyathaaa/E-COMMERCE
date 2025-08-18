/**
 * USER CONTROLLER
 *
 * This controller handles all user-related operations including:
 * - User profile management
 * - Password changes
 * - Account statistics
 * - Admin user management
 *
 * API ENDPOINTS:
 *
 * USER ROUTES (Protected - requires authentication):
 * GET    /api/v1/user/profile           - Get user profile
 * PUT    /api/v1/user/profile           - Update user profile
 * PUT    /api/v1/user/change-password   - Change user password
 * GET    /api/v1/user/stats             - Get user statistics
 * DELETE /api/v1/user/delete-account    - Delete user account
 *
 * ADMIN ROUTES (Protected - requires admin role):
 * GET    /api/v1/user/admin/users               - Get all users (paginated)
 * GET    /api/v1/user/admin/users/search        - Search users
 * GET    /api/v1/user/admin/users/:userId       - Get single user details
 * PUT    /api/v1/user/admin/users/:userId/status - Update user status
 * PUT    /api/v1/user/admin/users/:userId/verify - Verify/unverify user
 */

import usermodel from "../models/usermodel.js";
import { comparepassword, hashPassword } from "../helpers/authhelper.js";
import JWT from "jsonwebtoken";

// Get User Profile
export const getUserProfileController = async (req, res) => {
  try {
    const user = await usermodel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.log("getUserProfile error:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};

// Update User Profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const user = await usermodel.findById(req.user._id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).send({
        success: false,
        message: "Name, email, and phone are required",
      });
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const emailExists = await usermodel.findOne({ email });
      if (emailExists) {
        return res.status(400).send({
          success: false,
          message: "Email is already registered with another account",
        });
      }
    }

    // Prepare update data
    const updateData = {
      name,
      email,
      phone,
      address: address || "",
    };

    // Hash new password if provided
    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return res.status(400).send({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }
      updateData.password = await hashPassword(password);
    }

    const updatedUser = await usermodel
      .findByIdAndUpdate(req.user._id, updateData, { new: true })
      .select("-password");

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log("updateProfile error:", error);
    res.status(500).send({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// Change Password
export const changePasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await usermodel.findById(req.user._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await comparepassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await usermodel.findByIdAndUpdate(req.user._id, {
      password: hashedNewPassword,
    });

    res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("changePassword error:", error);
    res.status(500).send({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

// Get User Statistics
export const getUserStatsController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user basic info
    const user = await usermodel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Calculate account age
    const accountCreatedDays = Math.floor(
      (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
    );

    // TODO: When you implement orders, replace these with actual queries
    const stats = {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      totalSpent: 0,
      wishlistItems: 0,
      reviewsWritten: 0,
      accountAge: accountCreatedDays,
      lastLogin: user.updatedAt,
    };

    res.status(200).send({
      success: true,
      message: "User statistics fetched successfully",
      stats,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.log("getUserStats error:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching user statistics",
      error: error.message,
    });
  }
};

// Delete User Account
export const deleteAccountController = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Password is required to delete account",
      });
    }

    const user = await usermodel.findById(req.user._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Verify password
    const isMatch = await comparepassword(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Password is incorrect",
      });
    }

    // TODO: Before deleting user, you might want to:
    // 1. Cancel any pending orders
    // 2. Clear cart items
    // 3. Remove from wishlists
    // 4. Handle any related data cleanup

    await usermodel.findByIdAndDelete(req.user._id);

    res.status(200).send({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log("deleteAccount error:", error);
    res.status(500).send({
      success: false,
      message: "Error deleting account",
      error: error.message,
    });
  }
};

// Get All Users (Admin Only)
export const getAllUsersController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await usermodel
      .find({ role: { $ne: 1 } }) // Exclude admin users
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await usermodel.countDocuments({ role: { $ne: 1 } });
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.log("getAllUsers error:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Get Single User (Admin Only)
export const getSingleUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await usermodel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Calculate user statistics
    const accountAge = Math.floor(
      (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
    );

    res.status(200).send({
      success: true,
      message: "User details fetched successfully",
      user,
      accountAge,
    });
  } catch (error) {
    console.log("getSingleUser error:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching user details",
      error: error.message,
    });
  }
};

// Update User Status (Admin Only)
export const updateUserStatusController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "suspended"].includes(status)) {
      return res.status(400).send({
        success: false,
        message: "Invalid status. Must be active, inactive, or suspended",
      });
    }

    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === 1) {
      return res.status(400).send({
        success: false,
        message: "Cannot change admin user status",
      });
    }

    // Add status field to user model if not exists
    const updatedUser = await usermodel
      .findByIdAndUpdate(userId, { status }, { new: true })
      .select("-password");

    res.status(200).send({
      success: true,
      message: `User status updated to ${status}`,
      user: updatedUser,
    });
  } catch (error) {
    console.log("updateUserStatus error:", error);
    res.status(500).send({
      success: false,
      message: "Error updating user status",
      error: error.message,
    });
  }
};

// Search Users (Admin Only)
export const searchUsersController = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(400).send({
        success: false,
        message: "Search query is required",
      });
    }

    const searchRegex = new RegExp(query, "i");
    const searchConditions = {
      role: { $ne: 1 },
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ],
    };

    const users = await usermodel
      .find(searchConditions)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await usermodel.countDocuments(searchConditions);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).send({
      success: true,
      message: "Users search completed",
      users,
      searchQuery: query,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.log("searchUsers error:", error);
    res.status(500).send({
      success: false,
      message: "Error searching users",
      error: error.message,
    });
  }
};

// Verify User Account (Admin Only)
export const verifyUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { verified } = req.body; // true or false

    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Add verified field to user model if not exists
    const updatedUser = await usermodel
      .findByIdAndUpdate(userId, { verified: verified === true }, { new: true })
      .select("-password");

    res.status(200).send({
      success: true,
      message: `User ${verified ? "verified" : "unverified"} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.log("verifyUser error:", error);
    res.status(500).send({
      success: false,
      message: "Error updating user verification",
      error: error.message,
    });
  }
};
