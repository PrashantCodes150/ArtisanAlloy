import { notificationService } from './notificationService';

export interface OrderUpdatePayload {
  orderId: string;
  orderNumber: string;
  status: string;
  userId: string;
  timestamp: Date;
  message: string;
}

class OrderTrackingService {
  // Emit order status update
  emitOrderStatusUpdate(orderId: string, orderNumber: string, status: string, userId: string) {
    let statusMessage = '';
    
    switch(status) {
      case 'pending':
        statusMessage = `Your order #${orderNumber} has been placed and is pending confirmation.`;
        break;
      case 'confirmed':
        statusMessage = `Your order #${orderNumber} has been confirmed and is being prepared.`;
        break;
      case 'processing':
        statusMessage = `Your order #${orderNumber} is being processed and packed.`;
        break;
      case 'shipped':
        statusMessage = `Your order #${orderNumber} has been shipped and is on its way to you.`;
        break;
      case 'delivered':
        statusMessage = `Your order #${orderNumber} has been delivered. Enjoy your purchase!`;
        break;
      case 'cancelled':
        statusMessage = `Your order #${orderNumber} has been cancelled.`;
        break;
      case 'refunded':
        statusMessage = `Your order #${orderNumber} has been refunded.`;
        break;
      default:
        statusMessage = `Your order #${orderNumber} status has been updated to ${status}.`;
    }

    const payload: OrderUpdatePayload = {
      orderId,
      orderNumber,
      status,
      userId,
      timestamp: new Date(),
      message: statusMessage
    };

    // Send notification to user
    notificationService.sendNotificationToUser(userId, {
      type: 'ORDER_STATUS',
      title: `Order #${orderNumber} Update`,
      message: statusMessage,
      data: { orderId, orderNumber }
    });
  }

  // Emit shipping update with tracking info
  emitShippingUpdate(orderId: string, orderNumber: string, trackingNumber: string, carrier: string, userId: string) {
    notificationService.sendNotificationToUser(userId, {
      type: 'ORDER_STATUS',
      title: 'Order Shipped',
      message: `Your order #${orderNumber} has been shipped via ${carrier}. Tracking: ${trackingNumber}`,
      orderId,
      userId,
      timestamp: new Date()
    });
  }

  // Emit estimated delivery update
  emitEstimatedDelivery(orderId: string, orderNumber: string, estimatedDelivery: Date, userId: string) {
    notificationService.sendNotificationToUser(userId, {
      type: 'ORDER_STATUS',
      title: 'Estimated Delivery',
      message: `Your order #${orderNumber} is estimated to be delivered on ${estimatedDelivery.toLocaleDateString()}`,
      orderId,
      userId,
      timestamp: new Date()
    });
  }
}

export const orderTrackingService = new OrderTrackingService();
export default orderTrackingService;