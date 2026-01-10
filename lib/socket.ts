import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    initializeSocket();
  }
  return socket!;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Socket Service - This is what whatsapp.service.ts needs
export const socketService = {
  connect: () => {
    initializeSocket();
  },

  disconnect: () => {
    disconnectSocket();
  },

  isConnected: (): boolean => {
    return socket?.connected || false;
  },

  authenticate: (userId: string, role?: string) => {
    if (socket) {
      socket.emit('authenticate', { userId, role });
    }
  },

  on: (event: string, callback: Function) => {
    if (socket) {
      socket.on(event, callback as any);
    }
  },

  off: (event: string, callback: Function) => {
    if (socket) {
      socket.off(event, callback as any);
    }
  },

  emit: (event: string, data?: any) => {
    if (socket) {
      socket.emit(event, data);
    }
  },

  subscribeToConversation: (conversationId: string) => {
    if (socket) {
      socket.emit('subscribe-conversation', { conversationId });
    }
  },

  unsubscribeFromConversation: (conversationId: string) => {
    if (socket) {
      socket.emit('unsubscribe-conversation', { conversationId });
    }
  },

  sendTypingStatus: (conversationId: string, isTyping: boolean) => {
    if (socket) {
      socket.emit('user-typing', { conversationId, isTyping });
    }
  },

  markMessageAsRead: (messageId: string, conversationId: string) => {
    if (socket) {
      socket.emit('mark-read', { messageId, conversationId });
    }
  },

  getConnectionStatus: () => {
    return {
      connected: socket?.connected || false,
      id: socket?.id || null,
    };
  },

  ping: (): Promise<number> => {
    return new Promise((resolve) => {
      if (!socket) {
        resolve(-1);
        return;
      }

      const start = Date.now();
      socket.emit('ping', () => {
        resolve(Date.now() - start);
      });

      // Timeout after 5 seconds
      setTimeout(() => resolve(-1), 5000);
    });
  },

  initiateVideoCall: (data: {
    participantId: string;
    participantName: string;
    callType: 'support' | 'dispute' | 'consultation';
  }) => {
    if (socket) {
      socket.emit('initiate-video-call', data);
    }
  },

  respondToVideoCall: (callId: string, accepted: boolean) => {
    if (socket) {
      socket.emit('respond-video-call', { callId, accepted });
    }
  },

  endVideoCall: (callId: string) => {
    if (socket) {
      socket.emit('end-video-call', { callId });
    }
  },

  broadcastNotification: (data: {
    type: string;
    title: string;
    message: string;
    targetUsers?: string[];
  }) => {
    if (socket) {
      socket.emit('broadcast-notification', data);
    }
  },

  enableDebug: () => {
    if (socket) {
      socket.onAny((event, ...args) => {
        console.log(`[Socket Debug] ${event}:`, args);
      });
    }
  },

  disableDebug: () => {
    if (socket) {
      socket.offAny();
    }
  },
};

// Type exports for whatsapp.service.ts
export interface NewMessageData {
  message: {
    id: string;
    text: string;
    sender: 'customer' | 'admin' | 'bot';
    isBot: boolean;
  };
  customerPhone: string;
  timestamp: string;
}

export interface MessageStatusUpdateData {
  messageId: string;
  status: string;
}

export interface ConversationUpdatedData {
  conversationId: string;
  updates: any;
}

export interface UserTypingData {
  conversationId: string;
  isTyping: boolean;
}

export interface NotificationData {
  type: string;
  title: string;
  message: string;
  data?: any;
}

export interface VideoCallData {
  callId: string;
  type: 'incoming' | 'update' | 'ended';
  participantId: string;
  participantName: string;
  callType: 'support' | 'dispute' | 'consultation';
  roomId?: string;
}

export interface SystemAlertData {
  type: 'warning' | 'error' | 'info';
  message: string;
  data?: any;
}