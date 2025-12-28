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
import { StatCardProps, StatusBadgeProps } from '@/Types/types';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
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
  Area,
  AreaChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

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

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendValue, icon: Icon, delay }) => (
  <motion.div
    variants={itemVariants}
    className="bg-white rounded-lg border border-gray-200 p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-3xl font-semibold text-gray-900 mb-2">{value}</p>
        {trend && (
          <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-green-50' : trend === 'down' ? 'bg-red-50' : 'bg-gray-50'}`}>
        <Icon className={`w-6 h-6 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`} />
      </div>
    </div>
  </motion.div>
);

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config: Record<'operational' | 'degraded' | 'down', { color: string; dot: string }> = {
    operational: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    degraded: { color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    down: { color: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
  };

  const key = (status || '').toLowerCase() as keyof typeof config;
  const { color, dot } = config[key] ?? config.operational;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <span className={`w-2 h-2 mr-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
};

type ButtonVariant = 'default' | 'primary';
interface ActionButtonProps { icon: IconType; label: string; variant?: ButtonVariant; delay?: number }

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, variant = 'default', delay }) => {
  const router = useRouter();
  
  const handleClick = () => {
    // Add navigation logic based on the action
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
        // Trigger download or open reports page
        router.push('/admin/reports');
        break;
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

interface AlertItemProps { type: 'delivery' | 'payment' | 'stock'; message: string; time: string; delay?: number }

const AlertItem: React.FC<AlertItemProps> = ({ type, message, time, delay }) => {
  const icons: Record<AlertItemProps['type'], IconType> = {
    delivery: Truck,
    payment: CreditCard,
    stock: Package
  };
  const Icon = icons[type];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
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

// Revenue data for line chart
const revenueData = [
  { day: 'Mon', revenue: 420000, profit: 210000 },
  { day: 'Tue', revenue: 520000, profit: 260000 },
  { day: 'Wed', revenue: 580000, profit: 290000 },
  { day: 'Thu', revenue: 620000, profit: 310000 },
  { day: 'Fri', revenue: 810000, profit: 405000 },
  { day: 'Sat', revenue: 920000, profit: 460000 },
  { day: 'Sun', revenue: 780000, profit: 390000 },
];

// Category performance data for pie chart
const categoryData = [
  { name: 'Electronics', value: 35, color: '#8884d8' },
  { name: 'Fashion', value: 25, color: '#82ca9d' },
  { name: 'Groceries', value: 20, color: '#ffc658' },
  { name: 'Home & Living', value: 15, color: '#ff8042' },
  { name: 'Beauty', value: 5, color: '#0088fe' },
];

// Merchant performance data for bar chart
const merchantData = [
  { name: 'Tech Haven', orders: 450, revenue: 1200000, rating: 4.8 },
  { name: 'Urban Style', orders: 380, revenue: 980000, rating: 4.7 },
  { name: 'Fresh Mart', orders: 320, revenue: 750000, rating: 4.6 },
  { name: 'Home Comfort', orders: 280, revenue: 620000, rating: 4.5 },
  { name: 'Beauty Palace', orders: 190, revenue: 480000, rating: 4.4 },
];

// Geographic distribution data
const zoneData = [
  { zone: 'Ikeja', orders: 189, revenue: 2450000, deliveryTime: 35 },
  { zone: 'VI', orders: 167, revenue: 1980000, deliveryTime: 28 },
  { zone: 'Lekki', orders: 154, revenue: 1820000, deliveryTime: 42 },
  { zone: 'Surulere', orders: 143, revenue: 1650000, deliveryTime: 38 },
  { zone: 'Yaba', orders: 138, revenue: 1420000, deliveryTime: 32 },
  { zone: 'Ajah', orders: 112, revenue: 1250000, deliveryTime: 45 },
  { zone: 'Gbagada', orders: 98, revenue: 1120000, deliveryTime: 40 },
];

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name.includes('revenue') ? `₦${entry.value.toLocaleString()}` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Revenue Trend Chart Component
const RevenueTrendChart = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Revenue Trends (Weekly)</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>Last 7 days</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
const CategoryPerformanceChart = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Category Performance</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
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
const MerchantComparisonChart = () => {
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
          <BarChart data={merchantData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
const GeographicHeatMap = () => {
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
          <div className="text-lg font-semibold text-gray-900">Ikeja</div>
          <div className="text-sm text-gray-500">₦2.45M</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600">Fastest Delivery</div>
          <div className="text-lg font-semibold text-gray-900">Victoria Island</div>
          <div className="text-sm text-gray-500">28 mins avg</div>
        </div>
      </div>
    </div>
  );
};

// Order Velocity Radar Chart
const OrderVelocityChart = () => {
  const radarData = zoneData.map(zone => ({
    subject: zone.zone,
    A: zone.orders,
    fullMark: 200,
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

// Order Flow Panel Component (Keep your existing interactive buttons)
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

const OrderFlowPanel: React.FC = () => {
  const counts: Record<StatusKey, number> = {
    'awaiting-payment': 45,
    'awaiting-pickup': 62,
    'in-delivery': 89,
    'completed': 234,
    'issues': 8
  };

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
    <StatusBadge status={status} />
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
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days'>('today');

  return (
    <div className="flex-1 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
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
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    timeFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter === 'today' ? 'Today' : filter === '7days' ? 'Last 7 days' : 'Last 30 days'}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            label="Total Marketplace Value"
            value="₦12.4M"
            trend="up"
            trendValue="+12.5% from last period"
            icon={DollarSign}
            delay={0}
          />
          <StatCard
            label="Net Admin Profit"
            value="₦847K"
            trend="up"
            trendValue="+8.2% from last period"
            icon={Wallet}
            delay={80}
          />
          <StatCard
            label="Orders Today"
            value="347"
            trend="up"
            trendValue="+23 from yesterday"
            icon={ShoppingCart}
            delay={160}
          />
          <StatCard
            label="Active Deliveries"
            value="89"
            trend="down"
            trendValue="-12 from yesterday"
            icon={Truck}
            delay={240}
          />
        </motion.div>

        {/* Order Flow Status */}
        <OrderFlowPanel />

        {/* Charts Section - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueTrendChart />
          <CategoryPerformanceChart />
        </div>

        {/* Charts Section - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MerchantComparisonChart />
          <GeographicHeatMap />
        </div>

        {/* Bottom Three Columns Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order Velocity Radar */}
          <div className="lg:col-span-1">
            <OrderVelocityChart />
          </div>

          {/* Alerts & Exceptions */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Alerts & Exceptions</h2>
              <p className="text-sm text-gray-500 mt-1">Requires immediate attention</p>
            </div>
            <div className="divide-y divide-gray-200">
              <AlertItem
                type="delivery"
                message="5 deliveries delayed by more than 2 hours in Lekki zone"
                time="12 minutes ago"
                delay={0}
              />
              <AlertItem
                type="payment"
                message="3 payment failures requiring manual verification"
                time="25 minutes ago"
                delay={0.1}
              />
              <AlertItem
                type="stock"
                message="Low stock alert: 'Fresh Tomatoes' in 2 merchant stores"
                time="1 hour ago"
                delay={0.2}
              />
              <AlertItem
                type="delivery"
                message="Delivery partner API response time elevated"
                time="2 hours ago"
                delay={0.3}
              />
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