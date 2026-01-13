// @/types/dashboard.types.ts

// Base response interface for all API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  meta?: {
    timeFrame?: 'today' | '7days' | '30days';
    limit?: number;
    generatedAt?: string;
    [key: string]: any;
  };
}

// Order related interfaces
export interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
  };
  quantity: number;
  price: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
  orderItems: OrderItem[];
}

export interface OrderStats {
  ordersToPrepare: number;
  productsListed: number;
  lowStockCount: number;
  recentOrders: RecentOrder[];
  lowStockItems: LowStockItem[];
}

// Product related interfaces
export interface LowStockItem {
  name: string;
  stockQuantity: number;
  unit: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  category?: string;
  sku?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Sales trend interfaces
export interface SalesData {
  day: string;
  orders: number;
  revenue: number;
}

// Category performance interfaces
export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

// Top products interfaces
export interface TopProduct {
  name: string;
  orders: number;
  revenue: number;
}

// Hourly pattern interfaces
export interface HourlyPattern {
  hour: string;
  orders: number;
}

// Customer metrics interfaces
export interface CustomerMetric {
  metric: string;
  value: string | number;
  change: string;
}

// Delivery zone interfaces
export interface DeliveryZone {
  zone: string;
  orders: number;
  deliveryTime: number;
  averageFee?: number;
}

// Dashboard stats interface (combines all stats)
export interface DashboardStats {
  stats: OrderStats;
  salesTrend: SalesData[];
  categoryPerformance: CategoryData[];
  topProducts: TopProduct[];
  hourlyPattern: HourlyPattern[];
  customerMetrics: CustomerMetric[];
  deliveryZonePerformance: DeliveryZone[];
}

// Chart data interfaces for recharts
export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

// Time filter types
export type TimeFrame = 'today' | '7days' | '30days';

// Filter interface for dashboard queries
export interface DashboardFilters {
  timeFrame?: TimeFrame;
  startDate?: string;
  endDate?: string;
  category?: string;
  limit?: number;
}

// Merchant profile interface (for verification status)
export interface MerchantProfile {
  id: string;
  businessName: string;
  email: string;
  phone?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'UNDER_REVIEW';
  verification?: {
    rejectionReason?: string;
    submittedAt?: string;
    reviewedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Alert/Notification interfaces
export interface Alert {
  id: string;
  type: 'low_stock' | 'new_order' | 'verification' | 'payment';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export interface LowStockAlert {
  product: string;
  quantity: number;
  unit: string;
  threshold: number;
}

export interface NewOrderAlert {
  orderId: string;
  orderNumber: string;
  items: string[];
  totalAmount: number;
  time: string;
}

// Revenue interfaces
export interface RevenueStats {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  growthRate: number;
}

// Performance metrics
export interface PerformanceMetrics {
  orderCompletionRate: number;
  averagePreparationTime: number;
  customerSatisfaction: number;
  onTimeDeliveryRate: number;
  cancellationRate: number;
}

// Product category statistics
export interface CategoryStats {
  name: string;
  totalProducts: number;
  totalSales: number;
  averageRating: number;
  stockValue: number;
}

// Customer insights
export interface CustomerInsight {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  averageOrderValue: number;
}

// Delivery performance
export interface DeliveryPerformance {
  totalDeliveries: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  averageDeliveryTime: number;
  fastestDeliveryTime: number;
  slowestDeliveryTime: number;
}

// Inventory insights
export interface InventoryInsight {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  fastMovingProducts: TopProduct[];
  slowMovingProducts: TopProduct[];
}

// Financial summary
export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  averageOrderValue: number;
  revenueTrend: 'up' | 'down' | 'stable';
  profitMargin: number;
}

// Time-based analytics
export interface TimeAnalytics {
  peakHours: string[];
  bestSellingDays: string[];
  seasonalTrends: {
    month: string;
    sales: number;
    orders: number;
  }[];
}

// Dashboard widget interface
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'stat' | 'list' | 'table';
  data: any;
  size: 'small' | 'medium' | 'large';
  position: number;
  isVisible: boolean;
}

// Real-time updates
export interface RealTimeUpdate {
  type: 'new_order' | 'order_status_change' | 'stock_update' | 'payment_received';
  data: any;
  timestamp: string;
}

// Dashboard preferences
export interface DashboardPreferences {
  defaultTimeFrame: TimeFrame;
  widgets: DashboardWidget[];
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  autoRefreshInterval: number; // in seconds
}
