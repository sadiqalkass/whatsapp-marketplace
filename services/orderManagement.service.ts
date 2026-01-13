import api from '@/lib/api';

export const orderManagementService = {
  // Admin routes
  async getAllOrders() {
    const response = await api.get('/orders/admin/orders');
    return response.data;
  },

  async getOrderStats() {
    const response = await api.get('/orders/admin/orders/stats');
    return response.data;
  },

  async getOrderById(orderId: string) {
    const response = await api.get(`/orders/admin/orders/${orderId}`);
    return response.data;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const response = await api.put(`/orders/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  async assignCourier(orderId: string, courierId: string) {
    const response = await api.post(`/orders/admin/orders/${orderId}/assign-courier`, { courierId });
    return response.data;
  },

  async cancelOrder(orderId: string) {
    const response = await api.post(`/orders/admin/orders/${orderId}/cancel`);
    return response.data;
  },

  // Merchant routes
  async getMerchantOrders() {
    const response = await api.get('/orders/merchant/orders');
    return response.data;
  },

  async updateMerchantOrderStatus(orderId: string, status: string) {
    const response = await api.put(`/orders/merchant/orders/${orderId}/status`, { status });
    return response.data;
  },
};