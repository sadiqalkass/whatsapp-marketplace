import api from '@/lib/api';

export const reportApi = {
  getFinancialSummary: async (period: 'daily' | 'weekly' | 'monthly') => {
    const response = await api.get(`/reports/summary?period=${period}`);
    return response.data;
  },

  getMerchantPerformance: async (period: 'daily' | 'weekly' | 'monthly') => {
    const response = await api.get(`/reports/merchants?period=${period}`);
    return response.data;
  },

  getReportComparison: async () => {
    const response = await api.get('/reports/comparison');
    return response.data;
  },

  exportCSV: async (period: 'daily' | 'weekly' | 'monthly') => {
    const response = await api.get(`/reports/export/csv?period=${period}`, {
        responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report-${period}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};