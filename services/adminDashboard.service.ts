// @/services/admin-dashboard.service.ts (frontend)
import api from '@/lib/api';
import {
  TimeFrame,
  ApiResponse
} from '@/Types/merchantDashboard.types';

export interface AdminDashboardData {
  stats: {
    totalMerchants: number;
    totalOrders: number;
    totalRevenue: number;
    activeDeliveries: number;
    pendingMerchantVerifications: number;
    pendingPayouts: number;
    platformCommission: number;
    averageOrderValue: number;
    timeFrame: TimeFrame;
  };
  revenueTrend: Array<{
    period: string;
    revenue: number;
    profit: number;
    orders: number;
  }>;
  categoryPerformance: Array<{
    name: string;
    value: number;
    revenue: number;
    orders: number;
    color: string;
  }>;
  topMerchants: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
    rating: number;
    productsCount: number;
    recentOrders: number;
    commission: number;
  }>;
  deliveryZones: Array<{
    zone: string;
    orders: number;
    revenue: number;
    deliveryTime: number;
    averageFee: number;
  }>;
  orderFlow: {
    'awaiting-payment': number;
    'awaiting-pickup': number;
    'in-delivery': number;
    'completed': number;
    'issues': number;
  };
  alerts: Array<{
    type: 'delivery' | 'payment' | 'stock' | 'system';
    message: string;
    time: string;
    data?: any;
  }>;
  systemHealth: Array<{
    service: string;
    status: string;
    icon: string;
  }>;
  quickStats: {
    newMerchantsToday: number;
    newOrdersToday: number;
    totalRevenueToday: number;
    activeUsersToday: number;
  };
}

export const adminDashboardService = {
  async getDashboard(params?: {
    timeFrame?: TimeFrame;
  }): Promise<ApiResponse<AdminDashboardData>> {
    const response = await api.get('/admin/dashboard', { params });
    return response.data;
  },

  async getStats(params?: {
    timeFrame?: TimeFrame;
  }) {
    const response = await api.get('/admin/dashboard/stats', { params });
    return response.data;
  },

  async getRevenueTrend(params?: {
    timeFrame?: TimeFrame;
  }) {
    const response = await api.get('/admin/dashboard/revenue-trend', { params });
    return response.data;
  },

  async getTopMerchants(limit: number = 5) {
    const response = await api.get(`/admin/dashboard/top-merchants?limit=${limit}`);
    return response.data;
  },

  async getDeliveryZones() {
    const response = await api.get('/admin/dashboard/delivery-zones');
    return response.data;
  },

  async getOrderFlow() {
    const response = await api.get('/admin/dashboard/order-flow');
    return response.data;
  },

  async getAlerts() {
    const response = await api.get('/admin/dashboard/alerts');
    return response.data;
  },

  async getSystemHealth() {
    const response = await api.get('/admin/dashboard/system-health');
    return response.data;
  },

  async exportReport(data: {
    startDate: string;
    endDate: string;
    reportType: 'sales' | 'merchants' | 'deliveries' | 'all';
  }) {
    const response = await api.post('/admin/dashboard/export', data);
    return response.data;
  },

  async healthCheck() {
    const response = await api.get('/admin/dashboard/health');
    return response.data;
  }
};