'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Truck,
  CheckCircle,
  Clock,
  Package,
  XCircle,
  MessageSquare,
  CreditCard,
  MapPin,
  Users,
  Megaphone,
  Wallet,
  Download,
  ChevronDown,
  Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

// Import types and utilities
import {
  DashboardStats,
  SalesData,
  CategoryData,
  TopProduct,
  DeliveryZone,
  TimeFrame,
  ApiResponse,
  ChartDataPoint
} from '@/Types/merchantDashboard.types';
import {
  formatCurrency,
  formatNumber,
  formatDate,
  getTimeFrameLabel,
  prepareChartData
} from '@/utils/merchantDasboard.utils';

// Import dashboard service
import { dashboardService } from '@/services/merchantDashboard.service';
import toast from 'react-hot-toast';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

// Stat Card Interface
interface StatCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon: IconType;
  delay?: number;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendValue,
  icon: Icon,
  delay,
  loading = false
}) => (
  <motion.div
    variants={itemVariants}
    className="bg-white rounded-lg border border-gray-200 p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        {loading ? (
          <div className="h-10 bg-gray-200 rounded animate-pulse mb-2"></div>
        ) : (
          <>
            <p className="text-3xl font-semibold text-gray-900 mb-2">{value}</p>
            {trend && trendValue && (
              <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                <span>{trendValue}</span>
              </div>
            )}
          </>
        )}
      </div>
      <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-green-50' : trend === 'down' ? 'bg-red-50' : 'bg-gray-50'}`}>
        <Icon className={`w-6 h-6 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`} />
      </div>
    </div>
  </motion.div>
);

// Status Badge Interface
interface StatusBadgeProps {
  status: string;
  type?: 'system' | 'order' | 'delivery';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'system' }) => {
  const getConfig = () => {
    const config = {
      system: {
        operational: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
        degraded: { color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
        down: { color: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
      },
      order: {
        pending: { color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
        processing: { color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
        completed: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
        cancelled: { color: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
      },
      delivery: {
        pending: { color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' },
        in_transit: { color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
        delivered: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
        failed: { color: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
      }
    };

    const typeConfig = config[type];
    const key = (status || '').toLowerCase() as keyof typeof typeConfig;
    return typeConfig[key] || typeConfig.operational;
  };

  const { color, dot } = getConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <span className={`w-2 h-2 mr-1.5 rounded-full ${dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
};

// Action Button Interface
type ButtonVariant = 'default' | 'primary';
interface ActionButtonProps {
  icon: IconType;
  label: string;
  variant?: ButtonVariant;
  delay?: number;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  variant = 'default',
  delay,
  onClick
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default navigation logic
      switch (label) {
        case 'Verify New Merchant':
          router.push('/admin/onboarding');
          break;
        case 'Create Broadcast':
          router.push('/admin/broadcasts');
          break;
        case 'View Pending Payouts':
          router.push('/admin/payouts');
          break;
        case 'Download Daily Report':
          router.push('/admin/reports');
          break;
      }
    }
  };

  const variants: Record<ButtonVariant, string> = {
    default: 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
    primary: 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
  };

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={handleClick}
      className={`flex items-center justify-center w-full px-4 py-3 border rounded-lg text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${variants[variant]}`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </motion.button>
  );
};

// Alert Item Interface
interface AlertItemProps {
  type: 'delivery' | 'payment' | 'stock' | 'system';
  message: string;
  time: string;
  delay?: number;
  onClick?: () => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ type, message, time, delay, onClick }) => {
  const icons: Record<AlertItemProps['type'], IconType> = {
    delivery: Truck,
    payment: CreditCard,
    stock: Package,
    system: MessageSquare
  };
  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="flex items-start p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
    >
      <div className="flex-shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-orange-500" />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm text-gray-900">{message}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </motion.div>
  );
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name.toLowerCase().includes('revenue') ? `₦${Number(entry.value).toLocaleString()}` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Revenue Trend Chart Component
const RevenueTrendChart = ({ data, loading }: { data: SalesData[], loading: boolean }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading revenue data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No revenue data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Revenue Trends</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>Weekly</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" />
            <YAxis tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
            <Tooltip
              content={<CustomTooltip />}
              formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Category Performance Chart
const CategoryPerformanceChart = ({ data, loading }: { data: CategoryData[], loading: boolean }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading category data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No category data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Category Performance</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Market Share']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Merchant Comparison Chart
const MerchantComparisonChart = ({ data, loading }: { data: TopProduct[], loading: boolean }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading merchant data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No merchant data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Top Merchant Performance</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
          View All <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              content={<CustomTooltip />}
              formatter={(value: number, name: string) => {
                if (name === 'revenue') return [`₦${value.toLocaleString()}`, 'Revenue'];
                if (name === 'orders') return [value, 'Orders'];
                return [value, name];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Geographic Heat Map Chart
const GeographicHeatMap = ({ data, loading }: { data: DeliveryZone[], loading: boolean }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading delivery zone data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No delivery zone data available</p>
        </div>
      </div>
    );
  }

  const zoneData = data.map(zone => ({
    zone: zone.zone,
    orders: zone.orders,
    revenue: zone.averageFee || zone.orders * 10000, // Estimate revenue if not available
    deliveryTime: zone.deliveryTime
  }));

  const topZone = [...zoneData].sort((a, b) => b.revenue - a.revenue)[0];
  const fastestZone = [...zoneData].sort((a, b) => a.deliveryTime - b.deliveryTime)[0];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Delivery Zone Performance</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis
              type="number"
              dataKey="revenue"
              name="Revenue"
              unit="M"
              tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}`}
            />
            <YAxis
              type="number"
              dataKey="orders"
              name="Orders"
            />
            <ZAxis
              type="number"
              dataKey="deliveryTime"
              range={[50, 400]}
              name="Delivery Time"
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: number, name: string) => {
                if (name === 'revenue') return [`₦${value.toLocaleString()}`, 'Revenue'];
                if (name === 'orders') return [value, 'Orders'];
                if (name === 'deliveryTime') return [`${value} mins`, 'Avg Delivery Time'];
                return [value, name];
              }}
            />
            <Legend />
            <Scatter
              name="Delivery Zones"
              data={zoneData}
              fill="#8884d8"
              shape="circle"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600">Top Revenue Zone</div>
          <div className="text-lg font-semibold text-gray-900">{topZone?.zone || 'N/A'}</div>
          <div className="text-sm text-gray-500">{formatCurrency(topZone?.revenue || 0)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600">Fastest Delivery</div>
          <div className="text-lg font-semibold text-gray-900">{fastestZone?.zone || 'N/A'}</div>
          <div className="text-sm text-gray-500">{fastestZone?.deliveryTime || 0} mins avg</div>
        </div>
      </div>
    </div>
  );
};

// Order Velocity Radar Chart
const OrderVelocityChart = ({ data, loading }: { data: DeliveryZone[], loading: boolean }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading zone data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No zone data available</p>
        </div>
      </div>
    );
  }

  const radarData = data.slice(0, 6).map(zone => ({
    subject: zone.zone,
    A: zone.orders,
    fullMark: Math.max(...data.map(z => z.orders)),
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Zone Order Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar
              name="Orders"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Order Flow Panel Component
type StatusKey = 'awaiting-payment' | 'awaiting-pickup' | 'in-delivery' | 'completed' | 'issues';

const ORDER_STATUSES = [
  { key: 'awaiting-payment' as StatusKey, label: 'Awaiting Payment', icon: Clock, color: 'bg-yellow-500' },
  { key: 'awaiting-pickup' as StatusKey, label: 'Awaiting Pickup', icon: Package, color: 'bg-blue-500' },
  { key: 'in-delivery' as StatusKey, label: 'In Delivery', icon: Truck, color: 'bg-purple-500' },
  { key: 'completed' as StatusKey, label: 'Completed', icon: CheckCircle, color: 'bg-green-500' },
  { key: 'issues' as StatusKey, label: 'Issues', icon: XCircle, color: 'bg-red-500' }
];

const OrderStatusButton: React.FC<{ status: (typeof ORDER_STATUSES)[number]; count: number }> = ({ status, count }) => {
  const router = useRouter();
  const handleClick = () => {
    const params = new URLSearchParams();
    switch (status.key) {
      case 'awaiting-payment':
        params.set('payment', 'Awaiting Payment');
        break;
      case 'awaiting-pickup':
        params.set('status', 'Awaiting Pickup');
        break;
      case 'in-delivery':
        params.set('status', 'In Delivery');
        break;
      case 'completed':
        params.set('status', 'Completed');
        break;
      case 'issues':
        params.set('status', 'Issues');
        break;
      default:
        params.set('status', status.key);
    }
    router.push(`/admin/active-orders?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`View orders: ${status.label}`}
      className="flex-1 bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-lg transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      title={status.label}
    >
      <div className="flex items-center">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${status.color} text-white mr-3`}>
          <status.icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-900">{count}</p>
          <p className="text-sm text-gray-600">{status.label}</p>
        </div>
      </div>
    </button>
  );
};

const OrderFlowPanel: React.FC<{ loading?: boolean }> = ({ loading = false }) => {
  const counts: Record<StatusKey, number> = {
    'awaiting-payment': 45,
    'awaiting-pickup': 62,
    'in-delivery': 89,
    'completed': 234,
    'issues': 8
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 mb-8 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-lg border border-gray-200 mb-8"
    >
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Order Flow Status</h2>
        <span className="text-xs text-gray-500">Click to filter orders</span>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {ORDER_STATUSES.map(s => (
          <OrderStatusButton key={s.key} status={s} count={counts[s.key]} />
        ))}
      </div>
    </motion.div>
  );
};

// System Health Component
const SystemHealthItem: React.FC<{ service: string; status: string; icon: IconType; delay?: number }> = ({ service, status, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-center justify-between p-3"
  >
    <div className="flex items-center">
      <Icon className="w-5 h-5 text-gray-400 mr-3" />
      <span className="text-sm font-medium text-gray-900">{service}</span>
    </div>
    <StatusBadge status={status} type="system" />
  </motion.div>
);

// Quick Actions Card Component
const QuickActionsCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-white rounded-lg border border-gray-200"
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <p className="text-sm text-gray-500 mt-1">Frequently used admin actions</p>
      </div>
      <div className="p-6 space-y-3">
        <ActionButton icon={Users} label="Verify New Merchant" variant="primary" delay={0} />
        <ActionButton icon={Megaphone} label="Create Broadcast" delay={0.1} />
        <ActionButton icon={Wallet} label="View Pending Payouts" delay={0.2} />
        <ActionButton icon={Download} label="Download Daily Report" delay={0.3} />
      </div>
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">
          Need help? <a href="#" className="text-blue-600 hover:text-blue-700">View admin guide →</a>
        </p>
      </div>
    </motion.div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFrame>('today');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dashboard data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setRefreshing(true);

      // In a real app, you would have admin-specific endpoints
      // For now, using the merchant dashboard as example
      const response = await dashboardService.getMerchantDashboard({
        timeFrame: timeFilter,
        limit: 5
      });

      if (response.success && response.data) {
        const dashboardData = response.data;
        setStats(dashboardData);
        setSalesData(dashboardData.salesTrend || []);
        setCategoryData(dashboardData.categoryPerformance || []);
        setTopProducts(dashboardData.topProducts || []);
        setDeliveryZones(dashboardData.deliveryZonePerformance || []);

        // Generate alerts from stats
        const generatedAlerts = [];
        if (dashboardData.stats?.lowStockCount > 0) {
          generatedAlerts.push({
            type: 'stock' as const,
            message: `${dashboardData.stats.lowStockCount} products are low on stock`,
            time: 'Recently'
          });
        }
        if (dashboardData.deliveryZonePerformance?.some(zone => zone.deliveryTime > 60)) {
          generatedAlerts.push({
            type: 'delivery' as const,
            message: 'Some delivery zones experiencing delays',
            time: 'Today'
          });
        }
        setAlerts(generatedAlerts);
      }

      toast.success('Dashboard data loaded');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  const handleExport = () => {
    // Export functionality
    toast.success('Exporting dashboard data...');
    // Implement actual export logic here
  };

  // Calculate metrics from data
  const totalMarketplaceValue = stats?.stats?.productsListed
    ? stats.stats.productsListed * 10000 // Example calculation
    : 124000;

  const netAdminProfit = stats?.stats?.recentOrders
    ? stats.stats.recentOrders.reduce((sum, order) => sum + order.totalAmount, 0) * 0.15 // 15% commission
    : 84700;

  const ordersToday = stats?.stats?.recentOrders?.length || 347;
  const activeDeliveries = deliveryZones.reduce((sum, zone) => sum + zone.orders, 0) || 89;

  return (
    <div className="flex-1 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Marketplace overview and system status</p>
            </div>
            <div className="flex gap-2">
              {(['today', '7days', '30days'] as const).map((filter) => (
                <motion.button
                  key={filter}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => setTimeFilter(filter)}
                  disabled={refreshing}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${timeFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    } ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {filter === 'today' ? 'Today' : filter === '7days' ? 'Last 7 days' : 'Last 30 days'}
                </motion.button>
              ))}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="group relative flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 backdrop-blur-sm bg-white/80 border border-white/20 shadow-sm hover:shadow-md rounded-xl hover:bg-white/90 active:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                {/* Icon container with glow */}
                <div className={`relative p-1.5 rounded-lg ${refreshing ? 'bg-blue-50' : 'bg-gray-50 group-hover:bg-blue-50'}`}>
                  <svg
                    className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : 'text-gray-600 group-hover:text-blue-600 transition-colors'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>

                  {/* Glow effect */}
                  {refreshing && (
                    <div className="absolute inset-0 rounded-lg bg-blue-400/20 blur-sm animate-pulse" />
                  )}
                </div>

                {/* Text with fade effect */}
                <span className={`font-medium transition-all duration-300 ${refreshing ? 'text-blue-600' : 'group-hover:text-blue-700'}`}>
                  {refreshing ? 'Refreshing Data...' : 'Refresh Dashboard'}
                </span>

                {/* Status indicator */}
                {!refreshing && (
                  <span className="ml-1 text-xs text-gray-500 group-hover:text-blue-500 transition-colors">
                    • Live
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <StatCard
              label="Total Marketplace Value"
              value={formatCurrency(totalMarketplaceValue)}
              trend="up"
              trendValue="+12.5% from last period"
              icon={DollarSign}
              delay={0}
              loading={loading}
            />
            <StatCard
              label="Net Admin Profit"
              value={formatCurrency(netAdminProfit)}
              trend="up"
              trendValue="+8.2% from last period"
              icon={Wallet}
              delay={80}
              loading={loading}
            />
            <StatCard
              label="Orders Today"
              value={ordersToday}
              trend="up"
              trendValue="+23 from yesterday"
              icon={ShoppingCart}
              delay={160}
              loading={loading}
            />
            <StatCard
              label="Active Deliveries"
              value={activeDeliveries}
              trend="down"
              trendValue="-12 from yesterday"
              icon={Truck}
              delay={240}
              loading={loading}
            />
          </motion.div>
        )}

        {/* Order Flow Status */}
        <OrderFlowPanel loading={loading} />

        {/* Charts Section - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueTrendChart data={salesData} loading={loading} />
          <CategoryPerformanceChart data={categoryData} loading={loading} />
        </div>

        {/* Charts Section - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MerchantComparisonChart data={topProducts} loading={loading} />
          <GeographicHeatMap data={deliveryZones} loading={loading} />
        </div>

        {/* Bottom Three Columns Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Order Velocity Radar */}
          <div className="lg:col-span-1">
            <OrderVelocityChart data={deliveryZones} loading={loading} />
          </div>

          {/* Alerts & Exceptions */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Alerts & Exceptions</h2>
              <p className="text-sm text-gray-500 mt-1">Requires immediate attention</p>
            </div>
            <div className="divide-y divide-gray-200">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="p-3">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : alerts.length > 0 ? (
                alerts.map((alert, index) => (
                  <AlertItem
                    key={index}
                    type={alert.type}
                    message={alert.message}
                    time={alert.time}
                    delay={index * 0.1}
                  />
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No alerts at the moment</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions - Added Back */}
          <QuickActionsCard />
        </div>

        {/* System Health Monitor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 bg-white rounded-lg border border-gray-200"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">System Health Monitor</h2>
            <p className="text-sm text-gray-500 mt-1">Real-time service status</p>
          </div>
          <div className="divide-y divide-gray-200">
            <SystemHealthItem
              service="WhatsApp API"
              status="Operational"
              icon={MessageSquare}
              delay={0}
            />
            <SystemHealthItem
              service="Payment Gateway"
              status="Operational"
              icon={CreditCard}
              delay={0.1}
            />
            <SystemHealthItem
              service="Delivery Partner"
              status="Degraded"
              icon={MapPin}
              delay={0.2}
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;