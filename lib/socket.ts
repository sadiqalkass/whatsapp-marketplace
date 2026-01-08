// lib/socket.ts
import { io, Socket } from 'socket.io-client';

// ========== INTERFACE DEFINITIONS ==========

export interface SocketMessage {
    type: 'new-message' | 'message-status-update' | 'conversation-updated' |
    'user-typing' | 'user-online' | 'order-updated' | 'notification' |
    'video-call-incoming' | 'video-call-update' | 'system-alert';
    data: any;
    timestamp: string;
}

export interface NewMessageData {
    customerPhone: string;
    message: {
        id: string;
        sender: 'customer' | 'admin' | 'bot';
        text: string;
        time: string;
        isBot: boolean;
        messageType?: string;
        metadata?: any;
    };
    timestamp: string;
}

export interface MessageStatusUpdateData {
    messageId: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
}

export interface ConversationUpdatedData {
    conversationId: string;
    updates: {
        lastMessage?: string;
        lastMessageAt?: Date;
        unreadCount?: number;
        status?: 'active' | 'resolved' | 'archived';
        tags?: string[];
        assignedTo?: string;
    };
    timestamp: string;
}

export interface UserTypingData {
    conversationId: string;
    userId: string;
    userName?: string;
    isTyping: boolean;
}

export interface UserOnlineData {
    userId: string;
    userName?: string;
    isOnline: boolean;
    lastSeen?: Date;
    role?: string;
}

export interface OrderUpdatedData {
    orderId: string;
    updates: {
        status?: string;
        amount?: number;
        items?: any[];
        assignedTo?: string;
    };
    timestamp: string;
}

export interface NotificationData {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: string;
    metadata?: any;
}

export interface VideoCallData {
    callId: string;
    type: 'incoming' | 'accepted' | 'rejected' | 'ended' | 'screen-sharing';
    participantId: string;
    participantName: string;
    roomId?: string;
    metadata?: any;
    timestamp: string;
}

export interface SystemAlertData {
    id: string;
    level: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    timestamp: string;
    action?: string;
    metadata?: any;
}

// ========== SOCKET SERVICE CLASS ==========

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 10;
    private eventListeners: Map<string, Set<Function>> = new Map();
    private userId: string | null = null;
    private userRole: string | null = null;
    private connectionCallbacks: {
        onConnect?: () => void;
        onDisconnect?: (reason: string) => void;
        onError?: (error: Error) => void;
    } = {};

    private constructor() {
        // Private constructor for singleton
    }

    static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    // ========== CONNECTION MANAGEMENT ==========

    initialize(options?: {
        url?: string;
        autoConnect?: boolean;
        authToken?: string;
        onConnect?: () => void;
        onDisconnect?: (reason: string) => void;
        onError?: (error: Error) => void;
    }) {
        if (this.socket?.connected) {
            console.log('⚠️ Socket already connected');
            return;
        }

        const socketUrl = options?.url ||
            process.env.NEXT_PUBLIC_SOCKET_URL ||
            'http://localhost:5000';

        this.connectionCallbacks = {
            onConnect: options?.onConnect,
            onDisconnect: options?.onDisconnect,
            onError: options?.onError,
        };

        const socketOptions: any = {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 10000,
            timeout: 30000,
            autoConnect: options?.autoConnect ?? true,
            forceNew: false,
            withCredentials: true,
        };

        if (options?.authToken) {
            socketOptions.auth = {
                token: options.authToken,
            };
        }

        this.socket = io(socketUrl, socketOptions);
        this.setupEventListeners();
    }

    private setupEventListeners() {
        if (!this.socket) return;

        // Connection events
        this.socket.on('connect', () => {
            console.log('✅ Socket.IO connected:', this.socket?.id);
            this.reconnectAttempts = 0;

            // Re-authenticate if user was previously authenticated
            if (this.userId) {
                this.authenticate(this.userId, this.userRole);
            }

            this.emitEvent('connected', { socketId: this.socket?.id });
            this.connectionCallbacks.onConnect?.();
        });

        this.socket.on('disconnect', (reason: string) => {
            console.log('❌ Socket.IO disconnected:', reason);
            this.emitEvent('disconnected', { reason });
            this.connectionCallbacks.onDisconnect?.(reason);
        });

        this.socket.on('connect_error', (error: Error) => {
            console.error('Socket.IO connection error:', error);
            this.reconnectAttempts++;

            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.warn('Max reconnection attempts reached');
            }

            this.emitEvent('connect_error', { error });
            this.connectionCallbacks.onError?.(error);
        });

        this.socket.on('reconnect', (attemptNumber: number) => {
            console.log(`✅ Socket.IO reconnected after ${attemptNumber} attempts`);
            this.emitEvent('reconnected', { attemptNumber });
        });

        this.socket.on('reconnect_attempt', (attemptNumber: number) => {
            console.log(`🔄 Socket.IO reconnection attempt ${attemptNumber}`);
        });

        this.socket.on('reconnect_error', (error: Error) => {
            console.error('Socket.IO reconnection error:', error);
        });

        this.socket.on('reconnect_failed', () => {
            console.error('Socket.IO reconnection failed');
        });

        // ========== APPLICATION EVENTS ==========

        // Chat Events
        this.socket.on('new-message', (data: NewMessageData) => {
            this.emitEvent('new-message', data);
        });

        this.socket.on('message-status-update', (data: MessageStatusUpdateData) => {
            this.emitEvent('message-status-update', data);
        });

        this.socket.on('conversation-updated', (data: ConversationUpdatedData) => {
            this.emitEvent('conversation-updated', data);
        });

        this.socket.on('conversation-assigned', (data: { conversationId: string; adminId: string }) => {
            this.emitEvent('conversation-assigned', data);
        });

        this.socket.on('admin-typing-update', (data: UserTypingData) => {
            this.emitEvent('user-typing', data);
        });

        this.socket.on('customer-message', (data: NewMessageData) => {
            this.emitEvent('customer-message', data);
        });

        // Order Events
        this.socket.on('order-updated', (data: OrderUpdatedData) => {
            this.emitEvent('order-updated', data);
        });

        this.socket.on('order-created', (data: { orderId: string; customerId: string }) => {
            this.emitEvent('order-created', data);
        });

        this.socket.on('order-status-changed', (data: { orderId: string; status: string }) => {
            this.emitEvent('order-status-changed', data);
        });

        // Notification Events
        this.socket.on('notification', (data: NotificationData) => {
            this.emitEvent('notification', data);
        });

        // Video Call Events
        this.socket.on('video-call-incoming', (data: VideoCallData) => {
            this.emitEvent('video-call-incoming', data);
        });

        this.socket.on('video-call-update', (data: VideoCallData) => {
            this.emitEvent('video-call-update', data);
        });

        // System Events
        this.socket.on('system-event', (data: { event: string; data: any }) => {
            this.emitEvent('system-event', data);
        });

        this.socket.on('system-alert', (data: SystemAlertData) => {
            this.emitEvent('system-alert', data);
        });

        // User Events
        this.socket.on('admin-connected', (data: { adminId: string; socketId: string; role?: string }) => {
            this.emitEvent('admin-connected', data);
        });

        this.socket.on('admin-disconnected', (data: { adminId: string }) => {
            this.emitEvent('admin-disconnected', data);
        });

        this.socket.on('user-online', (data: UserOnlineData) => {
            this.emitEvent('user-online', data);
        });

        this.socket.on('user-offline', (data: { userId: string }) => {
            this.emitEvent('user-offline', data);
        });

        // Generic Events
        this.socket.onAny((eventName: string, ...args: any[]) => {
            this.emitEvent('*', { event: eventName, data: args });
        });
    }

    // ========== PUBLIC METHODS ==========

    connect() {
        if (!this.socket) {
            this.initialize();
        } else if (!this.socket.connected) {
            this.socket.connect();
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.userId = null;
            this.userRole = null;
            this.eventListeners.clear();
            console.log('🔌 Socket disconnected and cleaned up');
        }
    }

    // ========== AUTHENTICATION ==========

    authenticate(userId: string, role?: string) {
        this.userId = userId;
        this.userRole = role || null;

        if (this.socket?.connected) {
            this.socket.emit('admin-auth', { userId, role });
            console.log(`🔐 Authenticated as: ${userId} (${role})`);
        } else {
            console.warn('Socket not connected, authentication queued');
            this.once('connected', () => {
                this.socket?.emit('admin-auth', { userId, role });
            });
        }
    }

    // ========== EVENT EMITTERS ==========

    // Chat Events
    sendTypingStatus(conversationId: string, isTyping: boolean) {
        if (this.socket?.connected && this.userId) {
            this.socket.emit('admin-typing', {
                conversationId,
                userId: this.userId,
                isTyping
            });
        }
    }

    markMessageAsRead(messageId: string, conversationId: string) {
        if (this.socket?.connected) {
            this.socket.emit('mark-read', { messageId, conversationId });
        }
    }

    sendMessage(data: {
        conversationId: string;
        message: string;
        type?: string;
        metadata?: any;
    }) {
        if (this.socket?.connected) {
            this.socket.emit('send-message', data);
        }
    }

    // Order Events
    updateOrderStatus(orderId: string, status: string) {
        if (this.socket?.connected) {
            this.socket.emit('order-status-update', { orderId, status });
        }
    }

    // Video Call Events
    initiateVideoCall(data: {
        participantId: string;
        participantName: string;
        callType: 'support' | 'dispute' | 'consultation';
    }) {
        if (this.socket?.connected) {
            this.socket.emit('video-call-initiate', data);
        }
    }

    respondToVideoCall(callId: string, accepted: boolean) {
        if (this.socket?.connected) {
            this.socket.emit('video-call-response', { callId, accepted });
        }
    }

    endVideoCall(callId: string) {
        if (this.socket?.connected) {
            this.socket.emit('video-call-end', { callId });
        }
    }

    // System Events
    broadcastNotification(data: {
        type: string;
        title: string;
        message: string;
        targetUsers?: string[];
    }) {
        if (this.socket?.connected) {
            this.socket.emit('broadcast-notification', data);
        }
    }

    // ========== EVENT LISTENERS ==========

    on(event: string, callback: Function): () => void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event)?.add(callback);

        // Return unsubscribe function
        return () => {
            this.off(event, callback);
        };
    }

    off(event: string, callback?: Function) {
        if (!this.eventListeners.has(event)) return;

        if (callback) {
            this.eventListeners.get(event)?.delete(callback);
        } else {
            this.eventListeners.delete(event);
        }
    }

    once(event: string, callback: Function) {
        const onceCallback = (data: any) => {
            callback(data);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }

    private emitEvent(event: string, data: any) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    // ========== STATUS & UTILITIES ==========

    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    getSocketId(): string | null {
        return this.socket?.id || null;
    }

    getUserId(): string | null {
        return this.userId;
    }

    getUserRole(): string | null {
        return this.userRole;
    }

    getConnectionStatus(): {
        connected: boolean;
        socketId: string | null;
        userId: string | null;
        reconnectAttempts: number;
    } {
        return {
            connected: this.isConnected(),
            socketId: this.getSocketId(),
            userId: this.userId,
            reconnectAttempts: this.reconnectAttempts
        };
    }

    // ========== BATCH OPERATIONS ==========

    joinRoom(room: string) {
        if (this.socket?.connected) {
            this.socket.emit('join-room', room);
        }
    }

    leaveRoom(room: string) {
        if (this.socket?.connected) {
            this.socket.emit('leave-room', room);
        }
    }

    subscribeToConversation(conversationId: string) {
        this.joinRoom(`conversation:${conversationId}`);
    }

    unsubscribeFromConversation(conversationId: string) {
        this.leaveRoom(`conversation:${conversationId}`);
    }

    subscribeToOrder(orderId: string) {
        this.joinRoom(`order:${orderId}`);
    }

    unsubscribeFromOrder(orderId: string) {
        this.leaveRoom(`order:${orderId}`);
    }

    // ========== HEALTH CHECK ==========

    ping(): Promise<number> {
        return new Promise((resolve, reject) => {
            if (!this.socket?.connected) {
                reject(new Error('Socket not connected'));
                return;
            }

            const start = Date.now();
            this.socket.emit('ping', () => {
                const latency = Date.now() - start;
                resolve(latency);
            });

            setTimeout(() => {
                reject(new Error('Ping timeout'));
            }, 5000);
        });
    }

    // ========== DEBUGGING ==========

    enableDebug() {
        if (this.socket) {
            this.socket.onAny((eventName: string, ...args: any[]) => {
                console.log(`📡 [Socket] ${eventName}:`, args);
            });
        }
    }

    disableDebug() {
        if (this.socket) {
            this.socket.offAny();
        }
    }
}

// ========== EXPORTS ==========

// Singleton instance
export const socketService = SocketService.getInstance();

// Helper functions for common use cases
export const initializeSocket = (options?: {
    url?: string;
    autoConnect?: boolean;
    authToken?: string;
}) => {
    return socketService.initialize(options);
};

export const getSocket = (): Socket | null => {
    return socketService.isConnected() ? (socketService as any).socket : null;
};

export const disconnectSocket = () => {
    socketService.disconnect();
};

// Quick connect helper
export const quickConnect = (userId: string, role?: string) => {
    socketService.initialize();
    socketService.authenticate(userId, role);
    return socketService;
};

// React hook friendly exports
export const useSocket = () => {
    return {
        socket: socketService,
        isConnected: socketService.isConnected(),
        socketId: socketService.getSocketId(),
        userId: socketService.getUserId(),
        userRole: socketService.getUserRole(),
        connect: () => socketService.connect(),
        disconnect: () => socketService.disconnect(),
        authenticate: (userId: string, role?: string) => socketService.authenticate(userId, role),
        on: (event: string, callback: Function) => socketService.on(event, callback),
        off: (event: string, callback?: Function) => socketService.off(event, callback),
        sendTypingStatus: (conversationId: string, isTyping: boolean) =>
            socketService.sendTypingStatus(conversationId, isTyping),
        markMessageAsRead: (messageId: string, conversationId: string) =>
            socketService.markMessageAsRead(messageId, conversationId),
        updateOrderStatus: (orderId: string, status: string) =>
            socketService.updateOrderStatus(orderId, status),
    };
};

export default socketService;