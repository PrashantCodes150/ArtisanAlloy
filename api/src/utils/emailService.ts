import nodemailer from 'nodemailer';
import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 5000,  // fail fast if SMTP unreachable
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });
};

/**
 * Check if email is configured
 */
const isEmailConfigured = (): boolean => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

/**
 * Send email using nodemailer
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  if (!isEmailConfigured()) {
    logger.warn('Email not configured (EMAIL_USER/EMAIL_PASS missing) - skipping email send');
    return false;
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ArtisanAlloy <noreply@Artisan-Alloy.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId} to ${options.to}`);
    return true;
  } catch (error) {
    logger.error('Error sending email:', error);
    return false;
  }
};

/**
 * Email Templates
 */
export const emailTemplates = {
  /**
   * Email Verification Template
   */
  verificationEmail: (firstName: string, verificationUrl: string): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - ArtisanAlloy</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 32px; font-weight: bold; color: #d4af37; }
        .content { background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(212, 175, 55, 0.3); }
        h1 { color: #d4af37; margin-bottom: 20px; }
        p { line-height: 1.8; color: #e0e0e0; margin-bottom: 20px; }
        .button { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); color: #1a1a2e; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; }
        .button:hover { opacity: 0.9; }
        .footer { text-align: center; margin-top: 40px; color: #888; font-size: 14px; }
        .link { color: #d4af37; word-break: break-all; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">✦ ArtisanAlloy</div>
        </div>
        <div class="content">
          <h1>Welcome to ArtisanAlloy!</h1>
          <p>Hello ${firstName},</p>
          <p>Thank you for creating an account with ArtisanAlloy. To complete your registration and access all features, please verify your email address by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </p>
          <p>Or copy and paste this link in your browser:</p>
          <p class="link">${verificationUrl}</p>
          <p>This link will expire in 24 hours for security reasons.</p>
          <p>If you didn't create an account with us, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ArtisanAlloy. All rights reserved.</p>
          <p>Crafted with ♥ for jewelry lovers</p>
        </div>
      </div>
    </body>
    </html>
  `,

  /**
   * Password Reset Template
   */
  passwordResetEmail: (firstName: string, resetUrl: string): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - ArtisanAlloy</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 32px; font-weight: bold; color: #d4af37; }
        .content { background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(212, 175, 55, 0.3); }
        h1 { color: #d4af37; margin-bottom: 20px; }
        p { line-height: 1.8; color: #e0e0e0; margin-bottom: 20px; }
        .button { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); color: #1a1a2e; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 40px; color: #888; font-size: 14px; }
        .warning { background: rgba(255, 107, 107, 0.1); border: 1px solid rgba(255, 107, 107, 0.3); border-radius: 8px; padding: 15px; margin: 20px 0; }
        .link { color: #d4af37; word-break: break-all; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">✦ ArtisanAlloy</div>
        </div>
        <div class="content">
          <h1>Password Reset Request</h1>
          <p>Hello ${firstName},</p>
          <p>We received a request to reset the password for your ArtisanAlloy account. Click the button below to create a new password:</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>Or copy and paste this link in your browser:</p>
          <p class="link">${resetUrl}</p>
          <div class="warning">
            <p style="margin: 0; color: #ff6b6b;">⚠️ This link will expire in 10 minutes for security reasons.</p>
          </div>
          <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ArtisanAlloy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  /**
   * Order Confirmation Template
   */
  orderConfirmationEmail: (
    firstName: string,
    orderNumber: string,
    items: Array<{ name: string; quantity: number; price: number }>,
    subtotal: number,
    shipping: number,
    tax: number,
    total: number,
    shippingAddress: { fullName: string; addressLine1: string; city: string; state: string; postalCode: string }
  ): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmed - ArtisanAlloy</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 32px; font-weight: bold; color: #d4af37; }
        .content { background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(212, 175, 55, 0.3); }
        h1 { color: #d4af37; margin-bottom: 20px; }
        p { line-height: 1.8; color: #e0e0e0; margin-bottom: 20px; }
        .order-number { background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0; }
        .order-number span { color: #d4af37; font-size: 24px; font-weight: bold; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(212, 175, 55, 0.2); }
        .items-table th { color: #d4af37; }
        .totals { margin-top: 20px; }
        .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .totals-row.total { border-top: 2px solid #d4af37; margin-top: 10px; padding-top: 15px; font-size: 18px; color: #d4af37; }
        .address-box { background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 20px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 40px; color: #888; font-size: 14px; }
        .success-icon { font-size: 48px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">✦ ArtisanAlloy</div>
        </div>
        <div class="content">
          <div style="text-align: center;">
            <div class="success-icon">✓</div>
            <h1>Order Confirmed!</h1>
          </div>
          <p>Hello ${firstName},</p>
          <p>Thank you for your order! We're excited to prepare your beautiful jewelry pieces.</p>
          
          <div class="order-number">
            <p style="margin: 0; color: #888;">Order Number</p>
            <span>${orderNumber}</span>
          </div>

          <h3 style="color: #d4af37;">Order Items</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row"><span>Subtotal</span><span>₹${subtotal.toLocaleString()}</span></div>
            <div class="totals-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '₹' + shipping}</span></div>
            <div class="totals-row"><span>Tax (GST)</span><span>₹${tax.toLocaleString()}</span></div>
            <div class="totals-row total"><span>Total</span><span>₹${total.toLocaleString()}</span></div>
          </div>

          <h3 style="color: #d4af37; margin-top: 30px;">Shipping Address</h3>
          <div class="address-box">
            <p style="margin: 0;">${shippingAddress.fullName}</p>
            <p style="margin: 5px 0;">${shippingAddress.addressLine1}</p>
            <p style="margin: 0;">${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}</p>
          </div>

          <p>We'll send you another email when your order ships with tracking information.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ArtisanAlloy. All rights reserved.</p>
          <p>Questions? Contact us at support@Artisan-Alloy.com</p>
        </div>
      </div>
    </body>
    </html>
  `,

  /**
   * Payment Success Template
   */
  paymentSuccessEmail: (firstName: string, orderNumber: string, amount: number, transactionId: string): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Successful - ArtisanAlloy</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 32px; font-weight: bold; color: #d4af37; }
        .content { background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(212, 175, 55, 0.3); }
        h1 { color: #4ade80; margin-bottom: 20px; }
        p { line-height: 1.8; color: #e0e0e0; margin-bottom: 20px; }
        .payment-box { background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0; }
        .payment-amount { font-size: 36px; color: #4ade80; font-weight: bold; }
        .footer { text-align: center; margin-top: 40px; color: #888; font-size: 14px; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">✦ ArtisanAlloy</div>
        </div>
        <div class="content">
          <div style="text-align: center;">
            <h1>💳 Payment Successful!</h1>
          </div>
          <p>Hello ${firstName},</p>
          <p>Great news! Your payment has been successfully processed.</p>
          
          <div class="payment-box" style="text-align: center;">
            <p style="margin: 0 0 10px 0; color: #888;">Amount Paid</p>
            <div class="payment-amount">₹${amount.toLocaleString()}</div>
          </div>

          <div class="detail-row"><span>Order Number</span><span style="color: #d4af37;">${orderNumber}</span></div>
          <div class="detail-row"><span>Transaction ID</span><span style="color: #d4af37;">${transactionId}</span></div>
          <div class="detail-row"><span>Payment Method</span><span>Razorpay</span></div>
          <div class="detail-row"><span>Date</span><span>${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>

          <p style="margin-top: 30px;">Your order is now being processed and will be shipped soon. You'll receive tracking details once dispatched.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ArtisanAlloy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  /**
   * Order Shipped Template
   */
  orderShippedEmail: (
    firstName: string,
    orderNumber: string,
    trackingNumber: string,
    carrier: string,
    trackingUrl: string
  ): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Shipped - ArtisanAlloy</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 32px; font-weight: bold; color: #d4af37; }
        .content { background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(212, 175, 55, 0.3); }
        h1 { color: #d4af37; margin-bottom: 20px; }
        p { line-height: 1.8; color: #e0e0e0; margin-bottom: 20px; }
        .button { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); color: #1a1a2e; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; }
        .tracking-box { background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 40px; color: #888; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">✦ ArtisanAlloy</div>
        </div>
        <div class="content">
          <div style="text-align: center;">
            <h1>📦 Your Order is On Its Way!</h1>
          </div>
          <p>Hello ${firstName},</p>
          <p>Great news! Your order <strong style="color: #d4af37;">${orderNumber}</strong> has been shipped and is on its way to you.</p>
          
          <div class="tracking-box">
            <p style="margin: 0 0 10px 0;"><strong>Carrier:</strong> ${carrier}</p>
            <p style="margin: 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
          </div>

          <p style="text-align: center;">
            <a href="${trackingUrl}" class="button">Track Your Order</a>
          </p>

          <p>Your beautiful jewelry will arrive soon! We hope you love it as much as we loved creating it.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ArtisanAlloy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

/**
 * Helper functions to send specific emails
 */
export const sendVerificationEmail = async (
  email: string,
  firstName: string,
  verificationToken: string
): Promise<boolean> => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  return sendEmail({
    to: email,
    subject: 'Verify Your Email - ArtisanAlloy',
    html: emailTemplates.verificationEmail(firstName, verificationUrl),
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  firstName: string,
  resetToken: string
): Promise<boolean> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  return sendEmail({
    to: email,
    subject: 'Reset Your Password - ArtisanAlloy',
    html: emailTemplates.passwordResetEmail(firstName, resetUrl),
  });
};

export const sendOrderConfirmationEmail = async (
  email: string,
  firstName: string,
  orderNumber: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  subtotal: number,
  shipping: number,
  tax: number,
  total: number,
  shippingAddress: { fullName: string; addressLine1: string; city: string; state: string; postalCode: string }
): Promise<boolean> => {
  return sendEmail({
    to: email,
    subject: `Order Confirmed - ${orderNumber} | ArtisanAlloy`,
    html: emailTemplates.orderConfirmationEmail(firstName, orderNumber, items, subtotal, shipping, tax, total, shippingAddress),
  });
};

export const sendPaymentSuccessEmail = async (
  email: string,
  firstName: string,
  orderNumber: string,
  amount: number,
  transactionId: string
): Promise<boolean> => {
  return sendEmail({
    to: email,
    subject: `Payment Received - ${orderNumber} | ArtisanAlloy`,
    html: emailTemplates.paymentSuccessEmail(firstName, orderNumber, amount, transactionId),
  });
};

export const sendOrderShippedEmail = async (
  email: string,
  firstName: string,
  orderNumber: string,
  trackingNumber: string,
  carrier: string,
  trackingUrl: string
): Promise<boolean> => {
  return sendEmail({
    to: email,
    subject: `Order Shipped - ${orderNumber} | ArtisanAlloy`,
    html: emailTemplates.orderShippedEmail(firstName, orderNumber, trackingNumber, carrier, trackingUrl),
  });
};
