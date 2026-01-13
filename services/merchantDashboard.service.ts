// @/services/dashboard.service.ts
import api from '@/lib/api';
import {
    ApiResponse,
    DashboardStats,
    SalesData,
    CategoryData,
    TopProduct,
    HourlyPattern,
    CustomerMetric,
    DeliveryZone,
    TimeFrame
} from '@/Types/merchantDashboard.types';

export const dashboardService = {
    async getMerchantDashboard(params?: {
        timeFrame?: TimeFrame;
        limit?: number;
    }): Promise<ApiResponse<DashboardStats>> {
        const response = await api.get('/merchantdashboard/all', { params });
        return response.data;
    },

    async getMerchantStats(): Promise<ApiResponse> {
        const response = await api.get('/merchantdashboard/stats');
        return response.data;
    },

    async getSalesTrend(params?: {
        timeFrame?: TimeFrame;
    }): Promise<ApiResponse<SalesData[]>> {
        const response = await api.get('/merchantdashboard/sales-trend', { params });
        return response.data;
    },

    async getCategoryPerformance(): Promise<ApiResponse<CategoryData[]>> {
        const response = await api.get('/merchantdashboard/categories');
        return response.data;
    },

    async getTopProducts(limit: number = 5): Promise<ApiResponse<TopProduct[]>> {
        const response = await api.get(`/merchantdashboard/top-products?limit=${limit}`);
        return response.data;
    },

    async getHourlyPattern(): Promise<ApiResponse<HourlyPattern[]>> {
        const response = await api.get('/merchantdashboard/hourly-pattern');
        return response.data;
    },

    async getCustomerMetrics(): Promise<ApiResponse<CustomerMetric[]>> {
        const response = await api.get('/merchantdashboard/customer-metrics');
        return response.data;
    },

    async getDeliveryZonePerformance(): Promise<ApiResponse<DeliveryZone[]>> {
        const response = await api.get('/merchantdashboard/delivery-zones');
        return response.data;
    },

    async healthCheck(): Promise<ApiResponse> {
        const response = await api.get('/merchantdashboard/health');
        return response.data;
    },
};