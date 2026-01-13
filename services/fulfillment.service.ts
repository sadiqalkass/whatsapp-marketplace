import api from '@/lib/api';

export const fulfillmentService = {
  async getAllFulfillments() {
    const response = await api.get('/fulfillments/fulfillments');
    return response.data;
  },

  async getFulfillmentStats() {
    const response = await api.get('/fulfillments/fulfillments/stats');
    return response.data;
  },

  async getDeliveryById(deliveryId: string) {
    const response = await api.get(`/fulfillments/fulfillments/${deliveryId}`);
    return response.data;
  },

  async assignRider(deliveryId: string, riderId: string) {
    const response = await api.post(`/fulfillments/fulfillments/${deliveryId}/assign-rider`, { riderId });
    return response.data;
  },

  async notifyMerchant(deliveryId: string) {
    const response = await api.post(`/fulfillments/fulfillments/${deliveryId}/notify-merchant`);
    return response.data;
  },
};