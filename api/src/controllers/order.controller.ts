import { Request, Response, NextFunction } from 'express';
import { Order, Cart, Product, Coupon, User, IUser } from '../models';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';
import { APIFeatures } from '../utils/apiFeatures';
import { logger } from '../utils/logger';
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  fetchPayment,
  createRefund,
  getRazorpayKeyId,
  RAZORPAY_EVENTS,
} from '../utils/razorpayService';
import {
  sendOrderConfirmationEmail,
  sendPaymentSuccessEmail,
  sendOrderShippedEmail,
} from '../utils/emailService';

/**
 * Create new order
 * POST /api/v1/orders
 */
export const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { shippingAddress, paymentMethod, notes } = req.body;

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user!._id }).populate('items.product');
  
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Your cart is empty', 400));
  }

  // Validate stock and build order items
  const orderItems = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    
    if (!product || !product.isActive) {
      return next(new AppError(`Product "${item.product}" is no longer available`, 400));
    }

    if (product.stock < item.quantity) {
      return next(new AppError(`Only ${product.stock} units of "${product.name}" available`, 400));
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price,
      quantity: item.quantity,
      totalPrice: itemTotal,
    });

    // Reduce stock
    product.stock -= item.quantity;
    await product.save();
  }

  // Calculate totals
  const shippingCost = subtotal >= 999 ? 0 : 99; // Free shipping over ₹999
  const discount = cart.discount || 0;
  const taxRate = 0.18; // 18% GST
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + tax + shippingCost - discount;

  // Create order
  const order = await Order.create({
    user: req.user!._id,
    items: orderItems,
    shippingAddress,
    payment: {
      method: paymentMethod || 'cod',
      status: paymentMethod === 'cod' ? 'pending' : 'pending',
    },
    subtotal,
    shippingCost,
    discount,
    discountCode: cart.discountCode,
    tax,
    total,
    customerNotes: notes,
    status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
  });

  // Update coupon usage if applied
  if (cart.discountCode) {
    await Coupon.findOneAndUpdate(
      { code: cart.discountCode },
      {
        $inc: { usedCount: 1 },
        $push: {
          usedBy: {
            user: req.user!._id,
            usedAt: new Date(),
            orderId: order._id,
          },
        },
      }
    );
  }

  // Clear cart
  cart.clearCart();
  await cart.save();

  // Send order confirmation email for COD orders
  if (paymentMethod === 'cod') {
    try {
      const user = await User.findById(req.user!._id);
      if (user) {
        await sendOrderConfirmationEmail(
          user.email,
          user.firstName,
          order.orderNumber,
          orderItems.map(item => ({ name: item.name, quantity: item.quantity, price: item.totalPrice })),
          subtotal,
          shippingCost,
          tax,
          total,
          shippingAddress
        );
      }
    } catch (emailError) {
      logger.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order if email fails
    }
  }

  res.status(201).json({
    status: 'success',
    message: 'Order placed successfully',
    data: { order },
  });
});

/**
 * Get current user's orders
 * GET /api/v1/orders/my-orders
 */
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const features = new APIFeatures(
    Order.find({ user: req.user!._id }),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const orders = await features.query;
  const total = await Order.countDocuments({ user: req.user!._id });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    total,
    data: { orders },
  });
});

/**
 * Get single order
 * GET /api/v1/orders/:id
 */
export const getOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name slug images');

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Ensure user owns the order or is admin
  if (order.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return next(new AppError('You do not have permission to view this order', 403));
  }

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

/**
 * Get all orders (Admin only)
 * GET /api/v1/orders
 */
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const orders = await features.query.populate('user', 'firstName lastName email');
  const total = await Order.countDocuments();

  res.status(200).json({
    status: 'success',
    results: orders.length,
    total,
    data: { orders },
  });
});

/**
 * Update order status (Admin only)
 * PATCH /api/v1/orders/:id/status
 */
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { status, trackingNumber, trackingUrl, carrier } = req.body;

  const order = await Order.findById(req.params.id).populate('user', 'firstName email');

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Update status
  order.status = status;

  // Add to status history
  order.statusHistory.push({
    status,
    timestamp: new Date(),
    note: `Status updated to ${status}`,
    updatedBy: req.user!._id,
  });

  // Update tracking info if shipping
  if (status === 'shipped') {
    order.tracking = {
      carrier,
      trackingNumber,
      trackingUrl,
      shippedAt: new Date(),
    };

// Send shipping notification email
    try {
      // Fetch user details
      const user = await User.findById(order.user);
      if (user && user.email) {
        await sendOrderShippedEmail(
          user.email,
          user.firstName,
          order.orderNumber,
          trackingNumber || '',
          carrier || 'Courier',
          trackingUrl || '#'
        );
      }
    } catch (emailError) {
      logger.error('Failed to send shipping notification email:', emailError);
    }
  }

  if (status === 'delivered') {
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({
    status: 'success',
    message: `Order status updated to ${status}`,
    data: { order },
  });
});

/**
 * Cancel order
 * PATCH /api/v1/orders/:id/cancel
 */
export const cancelOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { reason } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Ensure user owns the order or is admin
  if (order.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return next(new AppError('You do not have permission to cancel this order', 403));
  }

  // Check if order can be cancelled
  if (!['pending', 'confirmed', 'processing'].includes(order.status)) {
    return next(new AppError('This order cannot be cancelled', 400));
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  // If payment was completed, initiate refund
  if (order.payment.status === 'completed' && order.payment.razorpayPaymentId) {
    try {
      const refund = await createRefund({
        paymentId: order.payment.razorpayPaymentId,
        notes: { reason: reason || 'Order cancelled', orderNumber: order.orderNumber },
      });
      order.payment.status = 'refunded';
      order.payment.refundedAt = new Date();
      order.payment.refundAmount = order.total;
      logger.info(`Refund initiated for order ${order.orderNumber}: ${refund.id}`);
    } catch (refundError) {
      logger.error('Failed to initiate refund:', refundError);
      // Continue with cancellation even if refund fails
    }
  }

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  order.cancellationReason = reason;
  order.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date(),
    note: reason || 'Order cancelled by user',
    updatedBy: req.user!._id,
  });

  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order cancelled successfully',
    data: { order },
  });
});

/**
 * Create Razorpay order for payment
 * POST /api/v1/orders/create-razorpay-order
 */
export const createRazorpayOrderHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Verify user owns the order
  if (order.user.toString() !== req.user!._id.toString()) {
    return next(new AppError('You do not have permission to pay for this order', 403));
  }

  // Check if order is in valid state for payment
  if (order.status !== 'pending') {
    return next(new AppError('This order is not pending payment', 400));
  }

  if (order.payment.status === 'completed') {
    return next(new AppError('Payment already completed for this order', 400));
  }

  try {
    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount: order.total,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        userId: req.user!._id.toString(),
      },
    });

    // Update order with Razorpay order ID
    order.payment.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      status: 'success',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        amount: order.total,
        currency: 'INR',
        razorpayOrderId: razorpayOrder.id,
        razorpayKeyId: getRazorpayKeyId(),
        prefill: {
          name: req.user!.fullName,
          email: req.user!.email,
          contact: req.user!.phone || '',
        },
      },
    });
  } catch (error: unknown) {
    logger.error('Failed to create Razorpay order:', error);
    return next(new AppError('Failed to initiate payment. Please try again.', 500));
  }
});

/**
 * Verify Razorpay payment
 * POST /api/v1/orders/verify-payment
 */
export const verifyPayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  // Validate required fields
  if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
    return next(new AppError('Missing payment verification details', 400));
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Verify payment signature
  const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

  if (!isValid) {
    // Update order status to failed
    order.payment.status = 'failed';
    order.statusHistory.push({
      status: 'payment_failed',
      timestamp: new Date(),
      note: 'Payment verification failed',
    });
    await order.save();
    
    return next(new AppError('Payment verification failed. Please contact support.', 400));
  }

  // Fetch payment details from Razorpay to double-verify
  try {
    const paymentDetails = await fetchPayment(razorpayPaymentId);
    
    if (paymentDetails.status !== 'captured') {
      return next(new AppError('Payment not captured. Please try again.', 400));
    }

    // Verify amount matches
    const paidAmount = paymentDetails.amount / 100; // Convert from paise
    if (Math.abs(paidAmount - order.total) > 1) { // Allow ₹1 tolerance for rounding
      logger.error(`Amount mismatch: Paid ${paidAmount}, Expected ${order.total}`);
      return next(new AppError('Payment amount mismatch. Please contact support.', 400));
    }
  } catch (fetchError) {
    logger.error('Failed to fetch payment details:', fetchError);
    // Continue if fetch fails but signature is valid
  }

  // Update order payment status
  order.payment = {
    ...order.payment,
    method: 'razorpay',
    transactionId: razorpayPaymentId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    status: 'completed',
    paidAt: new Date(),
  };
  order.status = 'confirmed';
  order.statusHistory.push({
    status: 'confirmed',
    timestamp: new Date(),
    note: 'Payment received via Razorpay',
  });

  await order.save();

  // Send confirmation emails
  try {
    const user = await User.findById(order.user);
    if (user) {
      // Send payment success email
      await sendPaymentSuccessEmail(
        user.email,
        user.firstName,
        order.orderNumber,
        order.total,
        razorpayPaymentId
      );

      // Send order confirmation email
      await sendOrderConfirmationEmail(
        user.email,
        user.firstName,
        order.orderNumber,
        order.items.map(item => ({ name: item.name, quantity: item.quantity, price: item.totalPrice })),
        order.subtotal,
        order.shippingCost,
        order.tax,
        order.total,
        order.shippingAddress
      );
    }
  } catch (emailError) {
    logger.error('Failed to send confirmation emails:', emailError);
    // Don't fail the request if email fails
  }

  logger.info(`Payment verified for order ${order.orderNumber}: ${razorpayPaymentId}`);

  res.status(200).json({
    status: 'success',
    message: 'Payment verified successfully',
    data: { order },
  });
});

/**
 * Razorpay Webhook Handler
 * POST /api/v1/orders/webhook/razorpay
 */
export const razorpayWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  
  if (!signature) {
    return res.status(400).json({ status: 'error', message: 'Missing signature' });
  }

  // Verify webhook signature
  const isValid = verifyWebhookSignature(JSON.stringify(req.body), signature);
  
  if (!isValid) {
    logger.warn('Invalid Razorpay webhook signature');
    return res.status(400).json({ status: 'error', message: 'Invalid signature' });
  }

  const event = req.body.event;
  const payload = req.body.payload;

  logger.info(`Razorpay webhook received: ${event}`);

  try {
    switch (event) {
      case RAZORPAY_EVENTS.PAYMENT_CAPTURED: {
        const payment = payload.payment.entity;
        const razorpayOrderId = payment.order_id;
        
        // Find order by Razorpay order ID
        const order = await Order.findOne({ 'payment.razorpayOrderId': razorpayOrderId });
        
        if (order && order.payment.status !== 'completed') {
          order.payment.status = 'completed';
          order.payment.razorpayPaymentId = payment.id;
          order.payment.paidAt = new Date();
          order.status = 'confirmed';
          order.statusHistory.push({
            status: 'confirmed',
            timestamp: new Date(),
            note: 'Payment captured via webhook',
          });
          await order.save();
          logger.info(`Order ${order.orderNumber} payment confirmed via webhook`);
        }
        break;
      }

      case RAZORPAY_EVENTS.PAYMENT_FAILED: {
        const payment = payload.payment.entity;
        const razorpayOrderId = payment.order_id;
        
        const order = await Order.findOne({ 'payment.razorpayOrderId': razorpayOrderId });
        
        if (order && order.payment.status === 'pending') {
          order.payment.status = 'failed';
          order.statusHistory.push({
            status: 'payment_failed',
            timestamp: new Date(),
            note: `Payment failed: ${payment.error_description || 'Unknown error'}`,
          });
          await order.save();
          logger.info(`Order ${order.orderNumber} payment failed via webhook`);
        }
        break;
      }

      case RAZORPAY_EVENTS.REFUND_PROCESSED: {
        const refund = payload.refund.entity;
        const paymentId = refund.payment_id;
        
        const order = await Order.findOne({ 'payment.razorpayPaymentId': paymentId });
        
        if (order) {
          order.payment.status = 'refunded';
          order.payment.refundedAt = new Date();
          order.payment.refundAmount = refund.amount / 100;
          order.statusHistory.push({
            status: 'refunded',
            timestamp: new Date(),
            note: `Refund processed: ₹${refund.amount / 100}`,
          });
          await order.save();
          logger.info(`Order ${order.orderNumber} refund processed via webhook`);
        }
        break;
      }

      default:
        logger.info(`Unhandled Razorpay event: ${event}`);
    }
  } catch {
    logger.error('Error processing Razorpay webhook:');
    // Return 200 to acknowledge receipt even if processing fails
    // Razorpay will retry if we return an error
  }

  // Always return 200 to acknowledge webhook
  res.status(200).json({ status: 'success', received: true });
});

/**
 * Get Razorpay key for frontend
 * GET /api/v1/orders/razorpay-key
 */
export const getRazorpayKey = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const keyId = getRazorpayKeyId();
    res.status(200).json({
      status: 'success',
      data: { keyId },
    });
  } catch (error) {
    return next(new AppError('Payment gateway not configured', 500));
  }
});

/**
 * Get order statistics (Admin only)
 * GET /api/v1/orders/stats
 */
export const getOrderStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
      },
    },
  ]);

  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { 'payment.status': 'completed' } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  // Get recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'firstName lastName email');

  // Get daily stats for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyStats = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        revenue: { $sum: '$total' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      byStatus: stats,
      recentOrders,
      dailyStats,
    },
  });
});

// Export with old function names for backward compatibility
export { createRazorpayOrderHandler as createRazorpayOrder };
