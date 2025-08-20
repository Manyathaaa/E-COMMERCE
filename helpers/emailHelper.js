import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Base email template
const getEmailTemplate = (content, title = "Magica E-commerce") => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e9ecef;
            }
            .logo {
                font-size: 2rem;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 10px;
            }
            .content {
                margin-bottom: 30px;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin: 15px 0;
            }
            .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                color: #6c757d;
                font-size: 0.9rem;
            }
            .info-box {
                background: #f8f9fa;
                border-left: 4px solid #667eea;
                padding: 15px;
                margin: 15px 0;
                border-radius: 4px;
            }
            .warning-box {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 15px 0;
                border-radius: 4px;
            }
            .success-box {
                background: #d4edda;
                border-left: 4px solid #28a745;
                padding: 15px;
                margin: 15px 0;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">✨ Magica</div>
                <p>Your Premium E-commerce Experience</p>
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                <p>© 2024 Magica E-commerce. All rights reserved.</p>
                <p>
                    <a href="mailto:support@magica.com">support@magica.com</a> | 
                    <a href="tel:+15551234567">+1 (555) 123-4567</a>
                </p>
                <p>
                    <a href="#" style="color: #667eea;">Unsubscribe</a> | 
                    <a href="#" style="color: #667eea;">Privacy Policy</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send email utility function
export const sendEmail = async (to, subject, htmlContent, attachments = []) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Magica E-commerce" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      attachments,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
};

// Welcome email for new users
export const sendWelcomeEmail = async (user) => {
  const content = `
    <h2>Welcome to Magica! 🎉</h2>
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>Thank you for joining Magica! We're excited to have you as part of our community.</p>
    
    <div class="info-box">
        <h3>What's Next?</h3>
        <ul>
            <li>Explore our premium product collection</li>
            <li>Set up your profile and preferences</li>
            <li>Start adding items to your wishlist</li>
            <li>Enjoy exclusive member benefits</li>
        </ul>
    </div>
    
    <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/category" class="button">
            Start Shopping
        </a>
    </div>
    
    <p>If you have any questions, our support team is here to help!</p>
    <p>Best regards,<br>The Magica Team</p>
  `;

  const htmlContent = getEmailTemplate(content, "Welcome to Magica!");
  return await sendEmail(user.email, "Welcome to Magica! 🎉", htmlContent);
};

// Order confirmation email
export const sendOrderConfirmationEmail = async (order, user) => {
  const content = `
    <h2>Order Confirmation 📦</h2>
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>Thank you for your order! We've received your order and are processing it.</p>
    
    <div class="success-box">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> ₹${order.orderSummary.total.toLocaleString()}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
    </div>
    
    <h3>Items Ordered:</h3>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
        ${order.products.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #dee2e6;">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Quantity: ${item.quantity} × ₹${item.price}</small>
                </div>
                <div><strong>₹${item.total.toLocaleString()}</strong></div>
            </div>
        `).join('')}
    </div>
    
    <div class="info-box">
        <h3>Shipping Address</h3>
        <p>
            ${order.shippingAddress.fullName}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
            Phone: ${order.shippingAddress.phone}
        </p>
    </div>
    
    <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/order-confirmation/${order._id}" class="button">
            Track Your Order
        </a>
    </div>
    
    <p>We'll send you another email when your order ships.</p>
    <p>Best regards,<br>The Magica Team</p>
  `;

  const htmlContent = getEmailTemplate(content, `Order Confirmation - ${order.orderNumber}`);
  return await sendEmail(user.email, `Order Confirmation - ${order.orderNumber}`, htmlContent);
};

// Order status update email
export const sendOrderStatusUpdateEmail = async (order, user, oldStatus) => {
  const statusMessages = {
    confirmed: "Your order has been confirmed and is being prepared.",
    processing: "Your order is currently being processed.",
    shipped: "Great news! Your order has been shipped.",
    "out-for-delivery": "Your order is out for delivery and will arrive soon!",
    delivered: "Your order has been delivered successfully!",
    cancelled: "Your order has been cancelled as requested.",
  };

  const statusColors = {
    confirmed: "#17a2b8",
    processing: "#ffc107",
    shipped: "#007bff",
    "out-for-delivery": "#fd7e14",
    delivered: "#28a745",
    cancelled: "#dc3545",
  };

  const content = `
    <h2>Order Status Update 📋</h2>
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>We have an update on your order <strong>${order.orderNumber}</strong>.</p>
    
    <div style="background: ${statusColors[order.status] || '#f8f9fa'}; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <h3 style="margin: 0; color: white;">Status: ${order.status.replace('-', ' ').toUpperCase()}</h3>
        <p style="margin: 10px 0 0 0; color: white;">${statusMessages[order.status]}</p>
    </div>
    
    ${order.tracking?.trackingNumber ? `
        <div class="info-box">
            <h3>Tracking Information</h3>
            <p><strong>Tracking Number:</strong> ${order.tracking.trackingNumber}</p>
            ${order.tracking.carrier ? `<p><strong>Carrier:</strong> ${order.tracking.carrier}</p>` : ''}
            ${order.tracking.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(order.tracking.estimatedDelivery).toLocaleDateString()}</p>` : ''}
        </div>
    ` : ''}
    
    <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/user/order-details/${order._id}" class="button">
            View Order Details
        </a>
    </div>
    
    <p>Thank you for shopping with us!</p>
    <p>Best regards,<br>The Magica Team</p>
  `;

  const htmlContent = getEmailTemplate(content, `Order Update - ${order.orderNumber}`);
  return await sendEmail(user.email, `Order Update - ${order.orderNumber}`, htmlContent);
};

// Support ticket confirmation email
export const sendSupportTicketConfirmationEmail = async (ticket, user) => {
  const content = `
    <h2>Support Ticket Created 🎧</h2>
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>We've received your support request and our team will get back to you shortly.</p>
    
    <div class="info-box">
        <h3>Ticket Details</h3>
        <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
        <p><strong>Subject:</strong> ${ticket.subject}</p>
        <p><strong>Category:</strong> ${ticket.category.replace('-', ' ').toUpperCase()}</p>
        <p><strong>Priority:</strong> ${ticket.priority.toUpperCase()}</p>
        <p><strong>Created:</strong> ${new Date(ticket.createdAt).toLocaleDateString()}</p>
    </div>
    
    <div class="warning-box">
        <h3>Expected Response Time</h3>
        <p>
            ${ticket.priority === 'urgent' ? 'Within 2-6 hours' : 
              ticket.priority === 'high' ? 'Within 2-6 hours' :
              ticket.priority === 'medium' ? 'Within 12-24 hours' : 
              'Within 24-48 hours'}
        </p>
    </div>
    
    <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/user/support/ticket/${ticket._id}" class="button">
            View Ticket
        </a>
    </div>
    
    <p>You can reply to this ticket or add additional information through your account.</p>
    <p>Best regards,<br>The Magica Support Team</p>
  `;

  const htmlContent = getEmailTemplate(content, `Support Ticket Created - ${ticket.ticketNumber}`);
  return await sendEmail(user.email, `Support Ticket Created - ${ticket.ticketNumber}`, htmlContent);
};

// Support ticket response email
export const sendSupportTicketResponseEmail = async (ticket, user, message) => {
  const content = `
    <h2>New Response on Your Support Ticket 💬</h2>
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>Our support team has responded to your ticket <strong>${ticket.ticketNumber}</strong>.</p>
    
    <div class="info-box">
        <h3>Support Response</h3>
        <p><strong>From:</strong> ${message.senderName} (Support Team)</p>
        <p><strong>Date:</strong> ${new Date(message.timestamp).toLocaleDateString()}</p>
        <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            <p style="margin: 0;">${message.message}</p>
        </div>
    </div>
    
    <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/user/support/ticket/${ticket._id}" class="button">
            View Full Conversation
        </a>
    </div>
    
    <p>You can continue the conversation by replying through your account.</p>
    <p>Best regards,<br>The Magica Support Team</p>
  `;

  const htmlContent = getEmailTemplate(content, `Support Response - ${ticket.ticketNumber}`);
  return await sendEmail(user.email, `Support Response - ${ticket.ticketNumber}`, htmlContent);
};

// Password reset email
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const content = `
    <h2>Password Reset Request 🔐</h2>
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>We received a request to reset your password. Click the button below to set a new password:</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    
    <div class="warning-box">
        <h3>Important:</h3>
        <ul>
            <li>This link will expire in 1 hour for security reasons</li>
            <li>If you didn't request this reset, please ignore this email</li>
            <li>Never share this link with anyone</li>
        </ul>
    </div>
    
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px;">
        ${resetUrl}
    </p>
    
    <p>If you didn't request this password reset, please contact our support team immediately.</p>
    <p>Best regards,<br>The Magica Security Team</p>
  `;

  const htmlContent = getEmailTemplate(content, "Password Reset Request");
  return await sendEmail(user.email, "Reset Your Magica Password", htmlContent);
};

// Email verification email
export const sendEmailVerificationEmail = async (user, verificationToken) => {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
  
  const content = `
    <h2>Verify Your Email Address ✉️</h2>
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>Thank you for registering with Magica! Please verify your email address to complete your account setup.</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" class="button">Verify Email Address</a>
    </div>
    
    <div class="info-box">
        <h3>Why verify your email?</h3>
        <ul>
            <li>Secure your account</li>
            <li>Receive order updates</li>
            <li>Get exclusive offers</li>
            <li>Enable password recovery</li>
        </ul>
    </div>
    
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px;">
        ${verifyUrl}
    </p>
    
    <p>This link will expire in 24 hours. If you didn't create this account, please ignore this email.</p>
    <p>Best regards,<br>The Magica Team</p>
  `;

  const htmlContent = getEmailTemplate(content, "Verify Your Email");
  return await sendEmail(user.email, "Verify Your Magica Account", htmlContent);
};

// Newsletter subscription email
export const sendNewsletterWelcomeEmail = async (email, name = "Valued Customer") => {
  const content = `
    <h2>Welcome to Our Newsletter! 📰</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thank you for subscribing to the Magica newsletter! You're now part of our exclusive community.</p>
    
    <div class="success-box">
        <h3>What to Expect:</h3>
        <ul>
            <li>🎯 Exclusive deals and discounts</li>
            <li>🆕 New product announcements</li>
            <li>💡 Style tips and recommendations</li>
            <li>🎉 Special member-only events</li>
        </ul>
    </div>
    
    <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/category" class="button">
            Explore Our Products
        </a>
    </div>
    
    <p>We promise to send you only the best content and never spam your inbox.</p>
    <p>Best regards,<br>The Magica Marketing Team</p>
  `;

  const htmlContent = getEmailTemplate(content, "Newsletter Subscription");
  return await sendEmail(email, "Welcome to Magica Newsletter! 📰", htmlContent);
};

// Admin notification email
export const sendAdminNotificationEmail = async (subject, message, data = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  
  const content = `
    <h2>Admin Notification 🚨</h2>
    <p>You have a new notification from the Magica system.</p>
    
    <div class="warning-box">
        <h3>${subject}</h3>
        <p>${message}</p>
        
        ${Object.keys(data).length > 0 ? `
            <h4>Additional Details:</h4>
            <ul>
                ${Object.entries(data).map(([key, value]) => 
                  `<li><strong>${key}:</strong> ${value}</li>`
                ).join('')}
            </ul>
        ` : ''}
    </div>
    
    <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/admin/dashboard" class="button">
            View Admin Dashboard
        </a>
    </div>
    
    <p>This is an automated notification from the Magica system.</p>
  `;

  const htmlContent = getEmailTemplate(content, "Admin Notification");
  return await sendEmail(adminEmail, `[ADMIN] ${subject}`, htmlContent);
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendSupportTicketConfirmationEmail,
  sendSupportTicketResponseEmail,
  sendPasswordResetEmail,
  sendEmailVerificationEmail,
  sendNewsletterWelcomeEmail,
  sendAdminNotificationEmail,
};
