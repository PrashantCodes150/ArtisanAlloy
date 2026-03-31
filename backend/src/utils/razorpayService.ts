import Razorpay from 'razorpay';
import crypto from 'crypto';
import { logger } from './logger';

// Initialize Razorpay instance
let razorpayInstance: Razorpay | null = null;

const getRazorpayInstance = (): Razorpay => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.');
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

export interface RazorpayOrderOptions {
  amount: number; // Amount in rupees (will be converted to paise)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayRefundOptions {
  paymentId: string;
  amount?: number; // Amount in rupees (partial refund). If not provided, full refund
  notes?: Record<string, string>;
}

/**
 * Create a Razorpay order
 */
export const createRazorpayOrder = async (options: RazorpayOrderOptions): Promise<RazorpayOrder> => {
  try {
    const razorpay = getRazorpayInstance();
    
    const orderOptions = {
      amount: Math.round(options.amount * 100), // Convert to paise
      currency: options.currency || 'INR',
      receipt: options.receipt,
      notes: options.notes || {},
    };

    const order = await razorpay.orders.create(orderOptions);
    logger.info(`Razorpay order created: ${order.id} for receipt: ${options.receipt}`);
    
    return order as RazorpayOrder;
  } catch (error: any) {
    logger.error('Error creating Razorpay order:', error);
    throw new Error(`Failed to create Razorpay order: ${error.message}`);
  }
};

/**
 * Verify Razorpay payment signature
 */
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new Error('Razorpay secret key not configured');
    }

    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === signature;
    
    if (isValid) {
      logger.info(`Payment signature verified for order: ${orderId}`);
    } else {
      logger.warn(`Invalid payment signature for order: ${orderId}`);
    }

    return isValid;
  } catch (error: any) {
    logger.error('Error verifying payment signature:', error);
    return false;
  }
};

/**
 * Verify Razorpay webhook signature
 */
export const verifyWebhookSignature = (
  body: string,
  signature: string,
  webhookSecret?: string
): boolean => {
  try {
    const secret = webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      logger.warn('Razorpay webhook secret not configured');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error: any) {
    logger.error('Error verifying webhook signature:', error);
    return false;
  }
};

/**
 * Fetch payment details from Razorpay
 */
export const fetchPayment = async (paymentId: string): Promise<any> => {
  try {
    const razorpay = getRazorpayInstance();
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error: any) {
    logger.error('Error fetching payment:', error);
    throw new Error(`Failed to fetch payment: ${error.message}`);
  }
};

/**
 * Fetch order details from Razorpay
 */
export const fetchOrder = async (orderId: string): Promise<any> => {
  try {
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.fetch(orderId);
    return order;
  } catch (error: any) {
    logger.error('Error fetching order:', error);
    throw new Error(`Failed to fetch order: ${error.message}`);
  }
};

/**
 * Create a refund
 */
export const createRefund = async (options: RazorpayRefundOptions): Promise<any> => {
  try {
    const razorpay = getRazorpayInstance();
    
    const refundOptions: any = {
      notes: options.notes || {},
    };

    // If amount specified, it's a partial refund (convert to paise)
    if (options.amount) {
      refundOptions.amount = Math.round(options.amount * 100);
    }

    const refund = await razorpay.payments.refund(options.paymentId, refundOptions);
    logger.info(`Refund created for payment: ${options.paymentId}`);
    
    return refund;
  } catch (error: any) {
    logger.error('Error creating refund:', error);
    throw new Error(`Failed to create refund: ${error.message}`);
  }
};

/**
 * Get Razorpay key ID for frontend
 */
export const getRazorpayKeyId = (): string => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new Error('Razorpay key ID not configured');
  }
  return keyId;
};

/**
 * Webhook event types
 */
export const RAZORPAY_EVENTS = {
  PAYMENT_AUTHORIZED: 'payment.authorized',
  PAYMENT_CAPTURED: 'payment.captured',
  PAYMENT_FAILED: 'payment.failed',
  ORDER_PAID: 'order.paid',
  REFUND_CREATED: 'refund.created',
  REFUND_PROCESSED: 'refund.processed',
  REFUND_FAILED: 'refund.failed',
} as const;

export type RazorpayEventType = typeof RAZORPAY_EVENTS[keyof typeof RAZORPAY_EVENTS];
