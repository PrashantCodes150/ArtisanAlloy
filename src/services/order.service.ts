import api from './api';
import type { ApiResponse } from './api';
import type { Address } from './auth.service';

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  totalPrice: number;
  variant?: { id: string; name: string };
}

export interface PaymentInfo {
  method: 'razorpay' | 'stripe' | 'cod' | 'upi';
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: Address;
  payment: PaymentInfo;
  subtotal: number;
  discount: number;
  discountCode?: string;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  statusHistory?: Array<{ status: string; timestamp: string; note?: string }>;
  tracking?: { carrier?: string; trackingNumber?: string; trackingUrl?: string; shippedAt?: string };
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'razorpay' | 'cod' | 'upi';
  notes?: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
}

export interface PaymentVerificationData {
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

const orderService = {
  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderData): Promise<ApiResponse<{ order: Order }>> {
    const response = await api.post('/orders', data);
    return response.data;
  },

  /**
   * Get current user's orders
   */
  async getMyOrders(page: number = 1, limit: number = 10): Promise<ApiResponse<{ orders: Order[] }> & { total: number }> {
    const response = await api.get(`/orders/my-orders?page=${page}&limit=${limit}&sort=-createdAt`);
    return response.data;
  },

  /**
   * Get single order by ID
   */
  async getOrder(id: string): Promise<ApiResponse<{ order: Order }>> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  /**
   * Cancel an order
   */
  async cancelOrder(id: string, reason?: string): Promise<ApiResponse<{ order: Order }>> {
    const response = await api.patch(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  /**
   * Create Razorpay order for payment
   */
  async createRazorpayOrder(orderId: string): Promise<ApiResponse<RazorpayOrderResponse>> {
    const response = await api.post('/orders/create-razorpay-order', { orderId });
    return response.data;
  },

  /**
   * Verify Razorpay payment
   */
  async verifyPayment(data: PaymentVerificationData): Promise<ApiResponse<{ order: Order }>> {
    const response = await api.post('/orders/verify-payment', data);
    return response.data;
  },

  /**
   * Get Razorpay key ID for frontend
   */
  async getRazorpayKey(): Promise<ApiResponse<{ keyId: string }>> {
    const response = await api.get('/orders/razorpay-key');
    return response.data;
  },

  /**
   * Retry payment for a pending order
   */
  async retryPayment(orderId: string): Promise<ApiResponse<RazorpayOrderResponse>> {
    return this.createRazorpayOrder(orderId);
  },
};

export default orderService;
