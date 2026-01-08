// services/whatsapp.service.ts
import api from '../lib/api';
import socketService, { 
  NewMessageData as SocketNewMessageData,
  MessageStatusUpdateData as SocketMessageStatusUpdateData,
  ConversationUpdatedData as SocketConversationUpdatedData,
  UserTypingData as SocketUserTypingData,
  NotificationData as SocketNotificationData,
  VideoCallData as SocketVideoCallData,
  SystemAlertData as SocketSystemAlertData
} from '@/lib/socket';

export interface WhatsAppStatus {
  phoneId: string;
  businessId: string;
  catalogId: string;
  tokenValid: boolean;
  daysUntilExpiry: number | null;
  lastRefreshed: Date;
  contactStats?: {
    totalRegistered: number;
    lastSync: Date;
  };
}

export interface WhatsAppContact {
  input: string;
  wa_id: string;
  status: 'valid' | 'invalid';
  profile_name?: string;
  last_seen?: string;
  is_blocked?: boolean;
  is_business?: boolean;
  business_name?: string;
}

export interface ContactInfo {
  wa_id: string;
  profile_name?: string;
  profile_picture_url?: string;
  status?: string;
  last_seen?: Date;
  is_blocked?: boolean;
  is_business?: boolean;
  business_profile?: {
    id?: string;
    name?: string;
    description?: string;
    vertical?: string;
    address?: string;
    email?: string;
    websites?: string[];
    profile_picture_url?: string;
  };
}

export interface ContactSyncResult {
  synced: number;
  newContacts: number;
  updatedContacts: number;
  errors: Array<{ phone: string; error: string }>;
}

export interface MessageStats {
  totalMessages: number;
  incomingMessages: number;
  outgoingMessages: number;
  lastMessageDate?: Date;
  firstMessageDate?: Date;
}

export interface ContactsOverview {
  totalContacts: number;
  businessContacts: number;
  blockedContacts: number;
  uniqueCountries: string[];
  messagesLast30Days: {
    total: number;
    incoming: number;
    outgoing: number;
    averagePerDay: number;
  };
}

export interface WhatsAppMessageData {
  to: string;
  message: string;
  type?: 'text' | 'template' | 'interactive';
  templateName?: string;
  buttons?: Array<{ id: string; title: string }>;
  previewUrl?: boolean;
}

export interface WhatsAppMediaData {
  to: string;
  mediaUrl: string;
  type: 'image' | 'document';
  caption?: string;
  filename?: string;
}

export interface WhatsAppCatalogData {
  to: string;
  message: string;
  catalogId?: string;
}

export interface WhatsAppInteractiveListData {
  to: string;
  message: string;
  buttonText: string;
  sections: Array<{
    title: string;
    rows: Array<{
      id: string;
      title: string;
      description?: string;
    }>;
  }>;
}

export interface ProductCatalogData {
  id: string;
  name: string;
  description: string;
  price: number;
  retailPrice?: number;
  images: string[];
  stockQuantity: number;
  category?: string;
}

export interface ConversationFilters {
  status?: 'active' | 'resolved' | 'archived';
  assignedTo?: string;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface Conversation {
  id: string;
  customerPhone: string;
  customerName?: string;
  lastMessage?: string;
  lastMessageAt: Date;
  unreadCount: number;
  status: 'active' | 'resolved' | 'archived';
  tags: string[];
  assignedTo?: string;
  assignedAdmin?: {
    id: string;
    name: string;
    email: string;
  };
  messages?: Message[];
}

export interface Message {
  id: string;
  sender: 'customer' | 'admin' | 'bot';
  text: string;
  time: string;
  isBot: boolean;
  timestamp: string;
  messageType?: string;
  status?: string;
  metadata?: any;
}

// Re-export socket interfaces with WhatsApp-specific naming
export type NewMessageData = SocketNewMessageData;
export type MessageStatusUpdateData = SocketMessageStatusUpdateData;
export type ConversationUpdatedData = SocketConversationUpdatedData;
export type UserTypingData = SocketUserTypingData;
export type NotificationData = SocketNotificationData;
export type VideoCallData = SocketVideoCallData;
export type SystemAlertData = SocketSystemAlertData;

export interface SendChatMessageData {
  conversationId?: string;
  customerPhone: string;
  message: string;
  type?: 'text' | 'interactive' | 'template';
  templateName?: string;
  buttons?: Array<{ id: string; title: string }>;
  adminId: string;
}

export interface BroadcastData {
  customerPhones: string[];
  message: string;
  templateName?: string;
}

export interface BroadcastResults {
  sent: number;
  failed: number;
  results: Array<{ phone: string; success: boolean; messageId?: string }>;
  errors: Array<{ phone: string; error: string }>;
}

export interface ChatStatistics {
  totalConversations: number;
  activeConversations: number;
  totalMessages: number;
  averageResponseTime: string;
  responseRate: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TokenResponse {
  success: boolean;
  message: string;
}

export interface BasicResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const whatsappService = {
  // ========== WHATSAPP STATUS & INFO ==========

  async getStatus(): Promise<{ success: boolean; data: WhatsAppStatus }> {
    const response = await api.get('/whatsapp/status');
    return response.data;
  },

  async getTemplates(): Promise<{ success: boolean; data: any }> {
    const response = await api.get('/whatsapp/templates');
    return response.data;
  },

  async getBusinessProfile(): Promise<{ success: boolean; data: any }> {
    const response = await api.get('/whatsapp/business-profile');
    return response.data;
  },

  // ========== TOKEN MANAGEMENT ==========

  async checkTokenHealth(): Promise<TokenResponse> {
    const response = await api.get('/whatsapp/token/health');
    return response.data;
  },

  async refreshToken(): Promise<TokenResponse> {
    const response = await api.post('/whatsapp/token/refresh');
    return response.data;
  },

  // ========== CONTACTS MANAGEMENT ==========

  async getRegisteredContacts(limit: number = 500): Promise<{ success: boolean; data: WhatsAppContact[] }> {
    const response = await api.get(`/whatsapp/contacts?limit=${limit}`);
    return response.data;
  },

  async getRecentContacts(days: number = 7, limit: number = 100): Promise<{ success: boolean; data: ContactInfo[] }> {
    const response = await api.get(`/whatsapp/contacts/recent?days=${days}&limit=${limit}`);
    return response.data;
  },

  async getContactsOverview(): Promise<{ success: boolean; data: ContactsOverview }> {
    const response = await api.get('/whatsapp/contacts/overview');
    return response.data;
  },

  async checkContacts(phoneNumbers: string[]): Promise<{ success: boolean; data: WhatsAppContact[] }> {
    const response = await api.post('/whatsapp/contacts/check', { phoneNumbers });
    return response.data;
  },

  async syncContacts(): Promise<{ success: boolean; data: ContactSyncResult; message: string }> {
    const response = await api.post('/whatsapp/contacts/sync');
    return response.data;
  },

  async getBlockedContacts(): Promise<{ success: boolean; data: string[] }> {
    const response = await api.get('/whatsapp/contacts/blocked');
    return response.data;
  },

  async searchContacts(query: string): Promise<{ success: boolean; data: ContactInfo[] }> {
    const response = await api.get(`/whatsapp/contacts/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  async getContactInfo(phoneNumber: string): Promise<{ success: boolean; data: ContactInfo }> {
    const response = await api.get(`/whatsapp/contacts/${encodeURIComponent(phoneNumber)}`);
    return response.data;
  },

  async getContactProfilePicture(phoneNumber: string): Promise<{ success: boolean; data: { profilePicture: string | null } }> {
    const response = await api.get(`/whatsapp/contacts/${encodeURIComponent(phoneNumber)}/profile-picture`);
    return response.data;
  },

  async getContactMessageStats(phoneNumber: string, days: number = 30): Promise<{ success: boolean; data: MessageStats }> {
    const response = await api.get(`/whatsapp/contacts/${encodeURIComponent(phoneNumber)}/message-stats?days=${days}`);
    return response.data;
  },

  async getContactBusinessProfile(phoneNumber: string): Promise<{ success: boolean; data: any }> {
    const response = await api.get(`/whatsapp/contacts/${encodeURIComponent(phoneNumber)}/business-profile`);
    return response.data;
  },

  async blockContact(phoneNumber: string): Promise<BasicResponse> {
    const response = await api.post(`/whatsapp/contacts/${encodeURIComponent(phoneNumber)}/block`);
    return response.data;
  },

  async unblockContact(phoneNumber: string): Promise<BasicResponse> {
    const response = await api.post(`/whatsapp/contacts/${encodeURIComponent(phoneNumber)}/unblock`);
    return response.data;
  },

  // ========== MESSAGE SENDING ==========

  async sendMessage(data: WhatsAppMessageData): Promise<{ success: boolean; data: any }> {
    const response = await api.post('/whatsapp/send', data);
    return response.data;
  },

  async sendMediaMessage(data: WhatsAppMediaData): Promise<{ success: boolean; data: any }> {
    const response = await api.post('/whatsapp/send-media', data);
    return response.data;
  },

  async sendCatalogMessage(data: WhatsAppCatalogData): Promise<{ success: boolean; data: any }> {
    const response = await api.post('/whatsapp/send-catalog', data);
    return response.data;
  },

  async sendInteractiveList(data: WhatsAppInteractiveListData): Promise<{ success: boolean; data: any }> {
    const response = await api.post('/whatsapp/send/list', data);
    return response.data;
  },

  // ========== PRODUCT CATALOG MANAGEMENT ==========

  async syncProductToCatalog(product: ProductCatalogData): Promise<{ 
    success: boolean; 
    data: { whatsappProductId: string }; 
    message: string 
  }> {
    const response = await api.post('/whatsapp/catalog/sync', product);
    return response.data;
  },

  async getCatalogProducts(): Promise<{ success: boolean; data: any }> {
    const response = await api.get('/whatsapp/catalog/products');
    return response.data;
  },

  async updateCatalogProduct(productId: string, product: Partial<ProductCatalogData>): Promise<BasicResponse> {
    const response = await api.put(`/whatsapp/catalog/products/${productId}`, product);
    return response.data;
  },

  async deleteCatalogProduct(productId: string): Promise<BasicResponse> {
    const response = await api.delete(`/whatsapp/catalog/products/${productId}`);
    return response.data;
  },

  // ========== CONVERSATION MANAGEMENT ==========

  async getConversations(filters: ConversationFilters = {}): Promise<{ 
    success: boolean; 
    data: Conversation[];
    pagination: Pagination
  }> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters.search) params.append('search', filters.search);
    if (filters.tags && filters.tags.length > 0) params.append('tags', filters.tags.join(','));
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/whatsapp/conversations?${params.toString()}`);
    return response.data;
  },

  async getConversation(conversationId: string): Promise<{ success: boolean; data: Conversation }> {
    const response = await api.get(`/whatsapp/conversations/${conversationId}`);
    return response.data;
  },

  async getConversationByPhone(phone: string): Promise<{ success: boolean; data: Conversation }> {
    const response = await api.get(`/whatsapp/conversations/phone/${encodeURIComponent(phone)}`);
    return response.data;
  },

  async updateConversation(conversationId: string, data: {
    tags?: string[];
    status?: 'active' | 'resolved' | 'archived';
    assignedTo?: string;
    customerName?: string;
  }): Promise<{ success: boolean; data: Conversation }> {
    const response = await api.put(`/whatsapp/conversations/${conversationId}`, data);
    return response.data;
  },

  async assignConversation(conversationId: string, adminId: string): Promise<{ success: boolean; data: Conversation }> {
    const response = await api.post(`/whatsapp/conversations/${conversationId}/assign`, { adminId });
    return response.data;
  },

  async markAsResolved(conversationId: string): Promise<{ success: boolean; data: Conversation }> {
    const response = await api.post(`/whatsapp/conversations/${conversationId}/resolve`);
    return response.data;
  },

  async updateTags(conversationId: string, tags: string[]): Promise<{ success: boolean; data: Conversation }> {
    const response = await api.put(`/whatsapp/conversations/${conversationId}/tags`, { tags });
    return response.data;
  },

  async updateCustomerInfo(conversationId: string, customerName: string): Promise<{ success: boolean; data: Conversation }> {
    const response = await api.put(`/whatsapp/conversations/${conversationId}/customer`, { customerName });
    return response.data;
  },

  // ========== MESSAGE MANAGEMENT ==========

  async sendChatMessage(data: SendChatMessageData): Promise<{ 
    success: boolean; 
    data: {
      messageId: string;
      whatsappMessageId?: string;
      conversationId?: string;
      phone?: string;
      message?: string;
      mediaUrl?: string;
      timestamp: Date;
    }
  }> {
    // Use conversationId if provided, otherwise send to phone directly
    const url = '/whatsapp/send';
    
    const response = await api.post(url, data);
    return response.data;
  },

  async getMessages(conversationId: string, limit: number = 50, before?: Date): Promise<{ success: boolean; data: Message[] }> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (before) params.append('before', before.toISOString());
    
    const response = await api.get(`/whatsapp/conversations/${conversationId}/messages?${params.toString()}`);
    return response.data;
  },

  async markMessagesAsRead(conversationId: string): Promise<BasicResponse> {
    const response = await api.post(`/whatsapp/conversations/${conversationId}/read`);
    return response.data;
  },

  // ========== REAL-TIME UPDATES ==========
  
  async markMessageAsRead(messageId: string, conversationId: string): Promise<void> {
    socketService.markMessageAsRead(messageId, conversationId);
  },

  // ========== TYPING INDICATORS ==========
  
  sendTypingStatus(conversationId: string, isTyping: boolean): void {
    socketService.sendTypingStatus(conversationId, isTyping);
  },

  // ========== SOCKET INTEGRATION ==========
  
  setupRealTimeUpdates(
    onNewMessage: (data: NewMessageData) => void,
    onMessageStatusUpdate: (data: MessageStatusUpdateData) => void,
    onConversationUpdated: (data: ConversationUpdatedData) => void,
    onUserTyping: (data: UserTypingData) => void,
    onNotification?: (data: NotificationData) => void,
    onVideoCall?: (data: VideoCallData) => void,
    onSystemAlert?: (data: SystemAlertData) => void
  ): () => void {
    // Set up event listeners
    socketService.on('new-message', onNewMessage);
    socketService.on('message-status-update', onMessageStatusUpdate);
    socketService.on('conversation-updated', onConversationUpdated);
    socketService.on('user-typing', onUserTyping);
    
    if (onNotification) {
      socketService.on('notification', onNotification);
    }
    
    if (onVideoCall) {
      socketService.on('video-call-incoming', onVideoCall);
      socketService.on('video-call-update', onVideoCall);
    }
    
    if (onSystemAlert) {
      socketService.on('system-alert', onSystemAlert);
    }
    
    // Return cleanup function
    return () => {
      socketService.off('new-message', onNewMessage);
      socketService.off('message-status-update', onMessageStatusUpdate);
      socketService.off('conversation-updated', onConversationUpdated);
      socketService.off('user-typing', onUserTyping);
      
      if (onNotification) {
        socketService.off('notification', onNotification);
      }
      
      if (onVideoCall) {
        socketService.off('video-call-incoming', onVideoCall);
        socketService.off('video-call-update', onVideoCall);
      }
      
      if (onSystemAlert) {
        socketService.off('system-alert', onSystemAlert);
      }
    };
  },

  connectSocket(userId: string, role?: string): void {
    socketService.connect();
    socketService.authenticate(userId, role);
  },

  disconnectSocket(): void {
    socketService.disconnect();
  },

  isSocketConnected(): boolean {
    return socketService.isConnected();
  },

  // ========== CONVERSATION SUBSCRIPTIONS ==========
  
  subscribeToConversation(conversationId: string): void {
    socketService.subscribeToConversation(conversationId);
  },

  unsubscribeFromConversation(conversationId: string): void {
    socketService.unsubscribeFromConversation(conversationId);
  },

  // ========== BROADCAST ==========

  async sendBroadcast(data: BroadcastData): Promise<{ 
    success: boolean; 
    data: BroadcastResults
  }> {
    const response = await api.post('/whatsapp/broadcast', data);
    return response.data;
  },

  // ========== STATISTICS ==========

  async getStatistics(startDate?: Date, endDate?: Date): Promise<{ success: boolean; data: ChatStatistics }> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    
    const response = await api.get(`/whatsapp/statistics?${params.toString()}`);
    return response.data;
  },

  // ========== QUICK MESSAGES (Common Templates) ==========

  async sendWelcomeMessage(phone: string): Promise<{ success: boolean; data: any }> {
    return this.sendMessage({
      to: phone,
      message: '👋 Welcome to our store! How can I help you today?',
      type: 'text'
    });
  },

  async sendOrderConfirmation(phone: string, orderNumber: string): Promise<{ success: boolean; data: any }> {
    return this.sendMessage({
      to: phone,
      message: `✅ Your order #${orderNumber} has been confirmed! We'll notify you when it ships.`,
      type: 'text'
    });
  },

  async sendShippingUpdate(phone: string, trackingNumber: string): Promise<{ success: boolean; data: any }> {
    return this.sendMessage({
      to: phone,
      message: `🚚 Your order has shipped! Tracking: ${trackingNumber}. You can track it on our website.`,
      type: 'text'
    });
  },

  async sendPaymentReminder(phone: string, orderNumber: string, amount: number): Promise<{ success: boolean; data: any }> {
    return this.sendMessage({
      to: phone,
      message: `💳 Payment Reminder: Order #${orderNumber} - ₦${amount.toLocaleString()}\nPlease complete payment to proceed with your order.`,
      type: 'text'
    });
  },

  // ========== UTILITY FUNCTIONS ==========

  formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If starts with 0, convert to +234
    if (digits.startsWith('0')) {
      return '+234' + digits.substring(1);
    }
    
    // If doesn't start with +, add it
    if (!phone.startsWith('+')) {
      return '+' + digits;
    }
    
    return phone;
  },

  maskPhoneNumber(phone: string): string {
    if (phone.length <= 4) return phone;
    const visibleDigits = 4;
    const prefix = phone.slice(0, phone.length - visibleDigits - 2);
    const suffix = phone.slice(-visibleDigits);
    return `${prefix}****${suffix}`;
  },

  // ========== SOCKET UTILITIES ==========
  
  getSocketConnectionStatus() {
    return socketService.getConnectionStatus();
  },

  pingSocket(): Promise<number> {
    return socketService.ping();
  },

  // ========== VIDEO CALL FUNCTIONS ==========
  
  initiateVideoCall(data: {
    participantId: string;
    participantName: string;
    callType: 'support' | 'dispute' | 'consultation';
  }): void {
    socketService.initiateVideoCall(data);
  },

  respondToVideoCall(callId: string, accepted: boolean): void {
    socketService.respondToVideoCall(callId, accepted);
  },

  endVideoCall(callId: string): void {
    socketService.endVideoCall(callId);
  },

  // ========== NOTIFICATION FUNCTIONS ==========
  
  broadcastNotification(data: {
    type: string;
    title: string;
    message: string;
    targetUsers?: string[];
  }): void {
    socketService.broadcastNotification(data);
  },

  // ========== SOCKET DEBUGGING ==========
  
  enableSocketDebug(): void {
    socketService.enableDebug();
  },

  disableSocketDebug(): void {
    socketService.disableDebug();
  }
};

export default whatsappService;