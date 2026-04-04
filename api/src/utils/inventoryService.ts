import { notificationService } from './notificationService';

export interface InventoryUpdatePayload {
  productId: string;
  productName: string;
  newStock: number;
  previousStock: number;
  timestamp: Date;
}

class InventoryService {
  // Emit inventory update notification
  emitInventoryUpdate(productId: string, productName: string, newStock: number, previousStock: number) {
    const payload: InventoryUpdatePayload = {
      productId,
      productName,
      newStock,
      previousStock,
      timestamp: new Date()
    };

    // Emit to specific product channel
    notificationService.sendNotificationToRoom(`product_${productId}`, {
      type: 'STOCK_UPDATE',
      title: 'Stock Update',
      message: `${productName} stock updated from ${previousStock} to ${newStock}`,
      productId,
      timestamp: new Date()
    });

    // Also broadcast if stock is low
    if (newStock <= 5) {
      notificationService.broadcastNotification('STOCK_UPDATE', {
        type: 'STOCK_UPDATE',
        title: 'Low Stock Alert',
        message: `${productName} is running low on stock (${newStock} remaining)`,
        productId,
        timestamp: new Date()
      });
    }
  }

  // Emit real-time price update
  emitPriceUpdate(productId: string, productName: string, newPrice: number, oldPrice: number) {
    const percentageChange = ((newPrice - oldPrice) / oldPrice) * 100;
    const changeType = newPrice > oldPrice ? 'increased' : 'decreased';

    notificationService.sendNotificationToRoom(`product_${productId}`, {
      type: 'PROMOTION',
      title: 'Price Update',
      message: `${productName} price has ${changeType} from ₹${oldPrice} to ₹${newPrice} (${percentageChange.toFixed(2)}%)`,
      productId,
      timestamp: new Date()
    });
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;