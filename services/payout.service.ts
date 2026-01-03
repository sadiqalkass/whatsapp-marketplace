import api from '@/lib/api';

export const payoutApi = {
  getMerchantPayouts: async () => {
    const response = await api.get('/payouts');
    return response.data;
  },

  processSinglePayout: async (merchantId: string) => {
    const response = await api.post(`/payouts/${merchantId}/process`);
    return response.data;
  },

  processBulkPayouts: async (merchantIds: string[]) => {
    const response = await api.post('/payouts/bulk-process', { merchantIds });
    return response.data;
  },
};