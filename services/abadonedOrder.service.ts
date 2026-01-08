import api from '@/lib/api';

export const abandonedOrderService = {
  async getAbandonedOrders() {
    const response = await api.get('/admin/abandoned-orders');
    return response.data;
  },

  async getStats() {
    const response = await api.get('/admin/abandoned-orders/stats');
    return response.data;
  },

  async resendPaymentLink(orderId: string) {
    const response = await api.post(`/admin/abandoned-orders/${orderId}/resend`);
    return response.data;
  },

  async cancelOrder(orderId: string) {
    const response = await api.post(`/admin/abandoned-orders/${orderId}/cancel`);
    return response.data;
  },

  async extendTimeout(orderId: string, minutes: number = 30) {
    const response = await api.post(`/admin/abandoned-orders/${orderId}/extend`, { minutes });
    return response.data;
  },
};