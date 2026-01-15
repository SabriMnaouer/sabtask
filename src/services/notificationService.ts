import { Notification } from '../types';
import { MOCK_TASKS } from '../constants';

type NotificationCallback = (notification: Notification) => void;

class MockWebSocketService {
  private intervalId: number | null = null;
  private subscribers: NotificationCallback[] = [];
  private isConnected: boolean = false;

  connect(userId: string) {
    if (this.isConnected) return;
    this.isConnected = true;
    
    console.log('[NotificationService] Connected to mock socket');

    // Send an initial welcome notification
    setTimeout(() => {
      this.notify({
        id: 'welcome-msg',
        userId,
        title: 'Welcome!',
        message: 'Real-time notifications are active.',
        type: 'COMMENT',
        read: false,
        createdAt: new Date().toISOString()
      });
    }, 1000);

    // Simulate random incoming notifications
    this.intervalId = window.setInterval(() => {
      // 40% chance to trigger a notification every check
      if (Math.random() > 0.6) {
        this.generateRandomNotification(userId);
      }
    }, 8000); 
  }

  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isConnected = false;
    console.log('[NotificationService] Disconnected');
  }

  subscribe(callback: NotificationCallback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }

  private notify(n: Notification) {
    this.subscribers.forEach(cb => cb(n));
  }

  private generateRandomNotification(userId: string) {
    const randomTask = MOCK_TASKS[Math.floor(Math.random() * MOCK_TASKS.length)];
    const types: Notification['type'][] = ['ASSIGNMENT', 'STATUS_CHANGE', 'COMMENT', 'DUE_DATE'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let title = '';
    let message = '';

    switch(type) {
        case 'ASSIGNMENT':
            title = 'New Assignment';
            message = `You were assigned to "${randomTask.title}"`;
            break;
        case 'STATUS_CHANGE':
            title = 'Status Update';
            message = `"${randomTask.title}" moved to ${randomTask.status}`;
            break;
        case 'COMMENT':
            title = 'New Comment';
            message = `Sabri commented on "${randomTask.title}"`;
            break;
        case 'DUE_DATE':
            title = 'Approaching Due Date';
            message = `"${randomTask.title}" is due soon`;
            break;
    }

    const notification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        title,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString(),
        taskId: randomTask.id
    };

    this.notify(notification);
  }
}

export const notificationSocket = new MockWebSocketService();
