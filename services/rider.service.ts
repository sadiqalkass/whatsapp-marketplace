import api from '@/lib/api';

export const riderService = {
  async getProfile() {
    const response = await api.get('/api/rider/profile');
    return response.data;
  },

  async updateStatus(status: 'OFFLINE' | 'AVAILABLE' | 'BUSY') {
    const response = await api.patch('/api/rider/status', { status });
    return response.data;
  },

  async updateLocation(latitude: number, longitude: number) {
    const response = await api.patch('/api/rider/location', { latitude, longitude });
    return response.data;
  },

  async getMyDeliveries() {
    const response = await api.get('/api/rider/deliveries');
    return response.data;
  },

  async updateDeliveryStatus(
    deliveryId: string,
    status: 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED',
    proofImage?: string,
    notes?: string
  ) {
    const response = await api.patch(`/api/rider/deliveries/${deliveryId}/status`, {
      status,
      proofImage,
      notes,
    });
    return response.data;
  },
};