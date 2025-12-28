'use client';

import React, { useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  AlertTriangle, 
  Wallet, 
  Clock, 
  CheckCircle, 
  Circle,
  TrendingUp,
  TrendingDown,
  Filter,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  MapPin,
  Users,
  MessageSquare,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

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

// Mock data for charts
const salesData = [
  { day: 'Mon', orders: 12, revenue: 45000 },
  { day: 'Tue', orders: 18, revenue: 68000 },
  { day: 'Wed', orders: 15, revenue: 52000 },
  { day: 'Thu', orders: 22, revenue: 85000 },
  { day: 'Fri', orders: 25, revenue: 92000 },
  { day: 'Sat', orders: 30, revenue: 110000 },
  { day: 'Sun', orders: 28, revenue: 98000 },
];

const categoryPerformance = [
  { name: 'Main Dishes', value: 35, color: '#FF6B6B' },
  { name: 'Snacks', value: 25, color: '#4ECDC4' },
  { name: 'Drinks', value: 20, color: '#45B7D1' },
  { name: 'Desserts', value: 15, color: '#FFE66D' },
  { name: 'Specialties', value: 5, color: '#95E1D3' },
];

const hourlyOrders = [
  { hour: '8AM', orders: 5 },
  { hour: '10AM', orders: 12 },
  { hour: '12PM', orders: 25 },
  { hour: '2PM', orders: 18 },
  { hour: '4PM', orders: 15 },
  { hour: '6PM', orders: 22 },
  { hour: '8PM', orders: 8 },
];

const customerMetrics = [
  { metric: 'New Customers', value: 45, change: '+12%' },
  { metric: 'Repeat Rate', value: '68%', change: '+5%' },
  { metric: 'Avg Order Value', value: '₦3,450', change: '+8%' },
  { metric: 'Rating', value: '4.7', change: '+0.2' },
];

const topProducts = [
  { name: 'Jollof Rice', orders: 120, revenue: 360000, rating: 4.9 },
  { name: 'Suya Platter', orders: 85, revenue: 297500, rating: 4.8 },
  { name: 'Egusi Soup', orders: 72, revenue: 216000, rating: 4.7 },
  { name: 'Pepper Soup', orders: 58, revenue: 174000, rating: 4.6 },
  { name: 'Moin Moin', orders: 45, revenue: 90000, rating: 4.5 },
];

const deliveryZones = [
  { zone: 'Ikeja', orders: 45, deliveryTime: 35 },
  { zone: 'VI', orders: 38, deliveryTime: 28 },
  { zone: 'Lekki', orders: 42, deliveryTime: 42 },
  { zone: 'Surulere', orders: 32, deliveryTime: 38 },
  { zone: 'Yaba', orders: 28, deliveryTime: 32 },
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

// Summary Card Component
const SummaryCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  trendValue, 
  linkText, 
  linkHref 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  color: string; 
  trend?: 'up' | 'down'; 
  trendValue?: string; 
  linkText: string; 
  linkHref: string;
}) => (
  <motion.div
    variants={itemVariants}
    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        {trend && (
          <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color.replace('500', '100')}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    <Link href={linkHref}>
      <button className="mt-4 text-sm font-medium hover:underline flex items-center">
        {linkText} →
      </button>
    </Link>
  </motion.div>
);

// Sales Trend Chart
const SalesTrendChart = () => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg border border-gray-200 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Sales Trend (Last 7 Days)
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>Weekly</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              name="Revenue (₦)"
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="orders" 
              name="Orders"
              stroke="#82ca9d" 
              fill="#82ca9d" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Category Performance Chart
const CategoryPerformanceChart = () => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg border border-gray-200 p-4"
    >
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <PieChart className="w-4 h-4" />
        Category Performance
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPie>
            <Pie
              data={categoryPerformance}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryPerformance.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Sales Share']}
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
          </RechartsPie>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Top Products Chart
const TopProductsChart = () => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg border border-gray-200 p-4"
    >
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        Top Products
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topProducts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="revenue" name="Revenue (₦)" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Hourly Order Pattern Chart
const HourlyOrderPattern = () => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg border border-gray-200 p-4"
    >
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Hourly Order Pattern
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={hourlyOrders} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="orders" 
              name="Orders"
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Peak hours: 12PM - 2PM & 6PM - 8PM</p>
      </div>
    </motion.div>
  );
};

// Delivery Zone Performance Chart
const DeliveryZoneChart = () => {
  const radarData = deliveryZones.map(zone => ({
    subject: zone.zone,
    A: zone.orders,
    B: zone.deliveryTime,
    fullMark: 50,
  }));

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg border border-gray-200 p-4"
    >
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Delivery Zone Performance
      </h3>
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
            <Radar
              name="Delivery Time (mins)"
              dataKey="B"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Customer Metrics Cards
const CustomerMetrics = () => {
  return (
    <motion.div
      variants={containerVariants}
      className="grid grid-cols-2 gap-4 mb-6"
    >
      {customerMetrics.map((metric, index) => (
        <motion.div
          key={metric.metric}
          variants={itemVariants}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <p className="text-sm font-medium text-gray-600 mb-1">{metric.metric}</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <span className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Merchant Dashboard Component
const MerchantDashboard = () => {
  const [verificationStatus, setVerificationStatus] = useState('not_verified');
  const [rejectionReason, setRejectionReason] = useState('Business license document is unclear. Please upload a clearer image.');
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days'>('today');

  const summaryData = {
    ordersToPrepare: 8,
    productsListed: 142,
    lowStockItems: 5,
    walletBalance: 245680.50
  };

  const recentOrders = [
    { id: 'ORD-1043', items: 'Jollof Rice, Fried Chicken (x2)', status: 'New', pickupTime: '2:30 PM' },
    { id: 'ORD-1042', items: 'Egusi Soup, Pounded Yam', status: 'Preparing', pickupTime: '2:15 PM' },
    { id: 'ORD-1041', items: 'Suya Platter, Chapman', status: 'Picked up', pickupTime: '1:45 PM' },
    { id: 'ORD-1040', items: 'Pepper Soup, White Rice', status: 'New', pickupTime: '3:00 PM' },
    { id: 'ORD-1039', items: 'Moin Moin (x3), Akara', status: 'Preparing', pickupTime: '2:45 PM' },
  ];

  const alerts = {
    lowStock: [
      { product: 'Fresh Tomatoes', quantity: 3, unit: 'kg' },
      { product: 'Palm Oil', quantity: 2, unit: 'liters' },
      { product: 'Chicken', quantity: 5, unit: 'pieces' },
      { product: 'Plantain', quantity: 8, unit: 'pieces' },
      { product: 'Yam', quantity: 1, unit: 'tuber' },
    ],
    newOrders: [
      { orderId: 'ORD-1043', time: '2 minutes ago' },
      { orderId: 'ORD-1040', time: '8 minutes ago' },
    ]
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'New': 'bg-blue-100 text-blue-700',
      'Preparing': 'bg-yellow-100 text-yellow-700',
      'Picked up': 'bg-green-100 text-green-700'
    };
    
    const icons = {
      'New': <Circle className="w-3 h-3" />,
      'Preparing': <Clock className="w-3 h-3" />,
      'Picked up': <CheckCircle className="w-3 h-3" />
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Your business performance overview</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {(['today', '7days', '30days'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      timeFilter === filter
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {filter === 'today' ? 'Today' : filter === '7days' ? 'Last 7 days' : 'Last 30 days'}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Verification Status Card */}
        {verificationStatus !== 'verified' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className={`bg-white rounded-lg shadow border-l-4 p-6 ${
              verificationStatus === 'rejected' ? 'border-red-500' : 
              verificationStatus === 'under_review' ? 'border-blue-500' : 
              'border-yellow-500'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {verificationStatus === 'rejected' ? (
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    ) : verificationStatus === 'under_review' ? (
                      <Clock className="w-6 h-6 text-blue-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    )}
                    <h2 className="text-xl font-semibold text-gray-900">
                      {verificationStatus === 'rejected' ? 'Verification Rejected' :
                      verificationStatus === 'under_review' ? 'Verification Under Review' :
                      'Verification Required'}
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {verificationStatus === 'rejected' ? (
                      <>Your verification was rejected. Reason: {rejectionReason}</>
                    ) : verificationStatus === 'under_review' ? (
                      'Your verification documents are being reviewed. We\'ll notify you once complete.'
                    ) : (
                      'Your account is not yet verified. Complete verification to start receiving orders.'
                    )}
                  </p>
                  {(verificationStatus === 'not_verified' || verificationStatus === 'rejected') && (
                    <Link href="/merchant/profile">
                      <button className={`font-medium px-6 py-2 rounded-lg transition-colors ${
                        verificationStatus === 'rejected' 
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}>
                        {verificationStatus === 'rejected' ? 'Resubmit Verification' : 'Complete Verification'}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Summary Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
        >
          <SummaryCard
            title="Orders to Prepare"
            value={summaryData.ordersToPrepare}
            icon={Package}
            color="text-orange-500"
            trend="up"
            trendValue="+3 from yesterday"
            linkText="View all orders"
            linkHref="/merchant/orders"
          />
          <SummaryCard
            title="Products Listed"
            value={summaryData.productsListed}
            icon={ShoppingBag}
            color="text-blue-500"
            trend="up"
            trendValue="+8 this month"
            linkText="Manage products"
            linkHref="/merchant/products"
          />
          <SummaryCard
            title="Low Stock Items"
            value={summaryData.lowStockItems}
            icon={AlertTriangle}
            color="text-red-500"
            trend="down"
            trendValue="-2 items restocked"
            linkText="Restock now"
            linkHref="/merchant/stock"
          />
          <SummaryCard
            title="Wallet Balance"
            value={`₦${summaryData.walletBalance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={Wallet}
            color="text-green-500"
            trend="up"
            trendValue="+₦24,500 today"
            linkText="Withdraw funds"
            linkHref="/merchant/wallet"
          />
        </motion.div>

        {/* Customer Metrics */}
        <CustomerMetrics />

        {/* Charts Section - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SalesTrendChart />
          <CategoryPerformanceChart />
        </div>

        {/* Charts Section - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopProductsChart />
          <HourlyOrderPattern />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Delivery Zone Chart */}
          <div className="lg:col-span-1">
            <DeliveryZoneChart />
          </div>

          {/* Recent Orders */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 bg-white rounded-lg border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <span className="text-xs text-gray-500">Live updates</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-600">{order.items}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.pickupTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-200">
              <Link href="/merchant/orders">
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  View all orders →
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Alerts Section */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 space-y-6"
          >
            {/* Low Stock Alerts */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Low Stock Alerts
                </h2>
                <span className="text-xs text-gray-500">Requires attention</span>
              </div>
              <div className="p-4 space-y-3">
                {alerts.lowStock.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.product}</p>
                      <p className="text-xs text-gray-600">Only {item.quantity} {item.unit} left</p>
                    </div>
                    <Link href="/merchant/stock">
                      <button className="text-xs font-medium text-red-600 hover:text-red-700 bg-white px-3 py-1 rounded border border-red-200">
                        Restock
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* New Order Notifications */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  New Orders
                </h2>
                <span className="text-xs text-gray-500">Just arrived</span>
              </div>
              <div className="p-4 space-y-3">
                {alerts.newOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.orderId}</p>
                      <p className="text-xs text-gray-600">{order.time}</p>
                    </div>
                    <Link href="/merchant/orders">
                      <button className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-white px-3 py-1 rounded border border-blue-200">
                        View
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₦92,500</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Preparation Time</p>
              <p className="text-2xl font-bold text-gray-900">24 mins</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Customer Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">96%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Order Completion</p>
              <p className="text-2xl font-bold text-gray-900">98%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MerchantDashboard;