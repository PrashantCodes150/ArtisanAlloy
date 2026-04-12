import { Server } from 'socket.io';

export interface NotificationData {
  type: string;
  title: string;
  message: string;
  data?: any;
  timestamp?: Date;
  orderId?: string;
  orderNumber?: string;
  userId?: string;
  productId?: string;
  productName?: string;
}

class NotificationService {
  private io: Server | null = null;

  initialize(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5174",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join-room', (room: string) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }

  sendNotificationToUser(userId: string, data: NotificationData) {
    if (this.io) {
      this.io.emit(`user-${userId}`, data);
    }
  }

  sendNotificationToRoom(room: string, data: NotificationData) {
    if (this.io) {
      this.io.to(room).emit('notification', data);
    }
  }

  broadcastNotification(event: string, data: any) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  sendLowStockAlert(data: any) {
    this.sendNotificationToRoom('admin', {
      type: 'LOW_STOCK',
      title: 'Low Stock Alert',
      message: `Product ${data.productName} is running low on stock`,
      data
    });
  }

  sendOutOfStockAlert(data: any) {
    this.sendNotificationToRoom('admin', {
      type: 'OUT_OF_STOCK',
      title: 'Out of Stock',
      message: `Product ${data.productName} is now out of stock`,
      data
    });
  }

  sendOrderStatusUpdate(data: any) {
    this.sendNotificationToUser(data.userId, {
      type: 'ORDER_STATUS',
      title: 'Order Update',
      message: `Your order #${data.orderNumber} status: ${data.status}`,
      data
    });
  }
}

export const notificationService = new NotificationService();