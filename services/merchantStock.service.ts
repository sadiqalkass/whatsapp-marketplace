import api from '@/lib/api';

export const merchantStockService = {
  async getMerchantProducts() {
    const response = await api.get('/stock/merchant/stock');
    return response.data;
  },

  async getStockStats() {
    const response = await api.get('/stock/merchant/stock/stats');
    return response.data;
  },

  async getProductById(productId: string) {
    const response = await api.get(`/stock/merchant/stock/${productId}`);
    return response.data;
  },

  async updateStock(productId: string, currentStock: number) {
    const response = await api.put(`/stock/merchant/stock/${productId}`, { currentStock });
    return response.data;
  },

  async bulkUpdateStock(updates: Array<{productId: string; currentStock: number}>) {
    const response = await api.post('/stock/merchant/stock/bulk-update', { updates });
    return response.data;
  },
};