import api from '@/lib/api';

export const escrowApi = {
  getAllEscrow: async () => {
    const response = await api.get('/escrow');
    return response.data;
  },

  getEscrowStats: async () => {
    const response = await api.get('/escrow/stats');
    return response.data;
  },
};