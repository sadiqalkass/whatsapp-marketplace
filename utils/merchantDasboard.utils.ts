// @/utils/dashboard.utils.ts
import {
  ApiResponse,
  OrderStats,
  SalesData,
  CategoryData,
  TopProduct,
  HourlyPattern,
  CustomerMetric,
  DeliveryZone,
  DashboardStats,
  TimeFrame
} from '@/Types/merchantDashboard.types';

// Type guards
export const isApiResponse = (data: any): data is ApiResponse => {
  return data && typeof data === 'object' && 'success' in data;
};

export const isOrderStats = (data: any): data is OrderStats => {
  return data && 
    typeof data === 'object' &&
    'ordersToPrepare' in data &&
    'productsListed' in data &&
    'lowStockCount' in data;
};

export const isDashboardStats = (data: any): data is DashboardStats => {
  return data &&
    typeof data === 'object' &&
    'stats' in data &&
    'salesTrend' in data &&
    'categoryPerformance' in data &&
    'topProducts' in data;
};

// Formatting utilities
export const formatCurrency = (amount: number, currency: string = '₦'): string => {
  return `${currency}${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
};

// Time frame utilities
export const getTimeFrameLabel = (timeFrame: TimeFrame): string => {
  const labels = {
    today: 'Today',
    '7days': 'Last 7 Days',
    '30days': 'Last 30 Days'
  };
  return labels[timeFrame];
};

export const getTimeFrameDateRange = (timeFrame: TimeFrame): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();

  switch (timeFrame) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case '7days':
      start.setDate(start.getDate() - 7);
      break;
    case '30days':
      start.setDate(start.getDate() - 30);
      break;
  }

  return { start, end };
};

// Chart data preparation
export const prepareChartData = (
  data: SalesData[] | HourlyPattern[] | TopProduct[],
  type: 'sales' | 'hourly' | 'products' = 'sales'
): any[] => {
  if (type === 'sales') {
    return (data as SalesData[]).map(item => ({
      ...item,
      revenueFormatted: formatCurrency(item.revenue),
      ordersFormatted: formatNumber(item.orders)
    }));
  }

  if (type === 'hourly') {
    return (data as HourlyPattern[]).map(item => ({
      ...item,
      ordersFormatted: formatNumber(item.orders)
    }));
  }

  if (type === 'products') {
    return (data as TopProduct[]).map(item => ({
      ...item,
      revenueFormatted: formatCurrency(item.revenue),
      ordersFormatted: formatNumber(item.orders)
    }));
  }

  return [];
};

// Status badge utilities
export const getOrderStatusBadge = (status: string): {
  label: string;
  color: string;
  bgColor: string;
} => {
  const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
    'PENDING': { label: 'Pending', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
    'ACCEPTED': { label: 'Accepted', color: 'text-blue-700', bgColor: 'bg-blue-100' },
    'PREPARING': { label: 'Preparing', color: 'text-orange-700', bgColor: 'bg-orange-100' },
    'READY': { label: 'Ready', color: 'text-green-700', bgColor: 'bg-green-100' },
    'DELIVERED': { label: 'Delivered', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
    'CANCELLED': { label: 'Cancelled', color: 'text-red-700', bgColor: 'bg-red-100' },
    'REFUNDED': { label: 'Refunded', color: 'text-purple-700', bgColor: 'bg-purple-100' }
  };

  return statusMap[status] || { label: status, color: 'text-gray-700', bgColor: 'bg-gray-100' };
};

export const getVerificationStatus = (status: string): {
  label: string;
  color: string;
  icon: string;
} => {
  const statusMap = {
    'PENDING': { label: 'Pending Review', color: 'text-yellow-600', icon: 'clock' },
    'VERIFIED': { label: 'Verified', color: 'text-green-600', icon: 'check-circle' },
    'REJECTED': { label: 'Rejected', color: 'text-red-600', icon: 'x-circle' },
    'UNDER_REVIEW': { label: 'Under Review', color: 'text-blue-600', icon: 'refresh-cw' }
  };

  return statusMap[status as keyof typeof statusMap] || 
    { label: status, color: 'text-gray-600', icon: 'help-circle' };
};

// Stock status utilities
export const getStockStatus = (quantity: number, threshold: number = 10): {
  label: string;
  color: string;
  bgColor: string;
  level: 'healthy' | 'low' | 'critical' | 'out'
} => {
  if (quantity <= 0) {
    return {
      label: 'Out of Stock',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      level: 'out'
    };
  }

  if (quantity <= threshold * 0.3) {
    return {
      label: 'Critical',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      level: 'critical'
    };
  }

  if (quantity <= threshold) {
    return {
      label: 'Low Stock',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      level: 'low'
    };
  }

  return {
    label: 'In Stock',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    level: 'healthy'
  };
};

// Data validation
export const validateDashboardData = (data: any): boolean => {
  try {
    if (!data || typeof data !== 'object') return false;
    
    // Check for basic dashboard structure
    const requiredKeys = ['stats', 'salesTrend', 'categoryPerformance'];
    return requiredKeys.every(key => key in data);
  } catch {
    return false;
  }
};

// Export all utilities
export default {
  isApiResponse,
  isOrderStats,
  isDashboardStats,
  formatCurrency,
  formatNumber,
  formatDate,
  formatTime,
  formatDateTime,
  getTimeFrameLabel,
  getTimeFrameDateRange,
  prepareChartData,
  getOrderStatusBadge,
  getVerificationStatus,
  getStockStatus,
  validateDashboardData
};