import api from '@/lib/api';

export const deliveryService = {
  getAllDeliveries: async (status?: string) => {
    const url = status ? `/deliveries?status=${status}` : '/deliveries';
    return api.get(url);
  },

  getDeliveryById: async (deliveryId: string) => {
    return api.get(`/deliveries/${deliveryId}`);
  },

  createDelivery: async (orderId: string) => {
    return api.post('/deliveries', { orderId });
  },

  updateStatus: async (deliveryId: string, status: string, notes?: string) => {
    return api.patch(`/deliveries/${deliveryId}/status`, { status, notes });
  },
};