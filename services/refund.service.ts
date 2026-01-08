import api from '@/lib/api'; // Your axios instance

export const refundService = {
  async getAllRefunds(status?: string) {
    const params = status && status !== 'All' ? { status } : {};
    const response = await api.get('/admin/refunds', { params });
    return response.data;
  },

  async approveRefund(orderId: string, notes?: string) {
    const response = await api.patch(`/admin/refunds/${orderId}/approve`, { notes });
    return response.data;
  },

  async rejectRefund(orderId: string, reason: string) {
    const response = await api.patch(`/admin/refunds/${orderId}/reject`, { reason });
    return response.data;
  },

  async processRefund(orderId: string) {
    const response = await api.post(`/admin/refunds/${orderId}/process`);
    return response.data;
  },
};