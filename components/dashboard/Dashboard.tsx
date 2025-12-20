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
  Download
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

// Reusable Components
interface StatCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon: IconType;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendValue, icon: Icon, delay }) => (
  <div
    className="bg-white rounded-lg border border-gray-200 p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in animate-preserve"
    style={{ animationDelay: `${delay ?? 0}ms` }}
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
  </div>
);

interface StatusBadgeProps { status: string }

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

interface AlertItemProps { type: 'delivery' | 'payment' | 'stock'; message: string; time: string; delay?: number }

const AlertItem: React.FC<AlertItemProps> = ({ type, message, time, delay }) => {
  const icons: Record<AlertItemProps['type'], IconType> = {
    delivery: Truck,
    payment: CreditCard,
    stock: Package
  };
  const Icon = icons[type];
  
  return (
    <div className="flex items-start p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors animate-fade-in animate-preserve" style={{ animationDelay: `${delay ?? 0}ms` }}>
      <div className="flex-shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-orange-500" />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm text-gray-900">{message}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

type ButtonVariant = 'default' | 'primary';
interface ActionButtonProps { icon: IconType; label: string; variant?: ButtonVariant; delay?: number }

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, variant = 'default', delay }) => {
  const variants: Record<ButtonVariant, string> = {
    default: 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
    primary: 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
  };
  
  return (
    <button
      className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition transform duration-200 hover:-translate-y-1 animate-fade-in animate-preserve ${variants[variant]}`}
      style={{ animationDelay: `${delay ?? 0}ms` }}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );
};

// Interactive Order Flow Status: clickable buttons that navigate to Orders & Fulfillment

type StatusKey = 'awaiting-payment' | 'awaiting-pickup' | 'in-delivery' | 'completed' | 'issues';

const ORDER_STATUSES: {
  key: StatusKey;
  label: string;
  icon: IconType;
  color: string;
}[] = [
  { key: 'awaiting-payment', label: 'Awaiting Payment', icon: Clock, color: 'bg-yellow-500' },
  { key: 'awaiting-pickup', label: 'Awaiting Pickup', icon: Package, color: 'bg-blue-500' },
  { key: 'in-delivery', label: 'In Delivery', icon: Truck, color: 'bg-purple-500' },
  { key: 'completed', label: 'Completed', icon: CheckCircle, color: 'bg-green-500' },
  { key: 'issues', label: 'Issues', icon: XCircle, color: 'bg-red-500' }
];

const OrderStatusButton: React.FC<{ status: (typeof ORDER_STATUSES)[number]; count: number }> = ({ status, count }) => {
  const router = useRouter();
  const handleClick = () => {
    // Navigate to Active Orders page with a suitable query param (filter)
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

    router.push(`/active-orders?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`View orders: ${status.label}`}
      className="flex-1 bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-lg transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 animate-fade-in animate-preserve"
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
  // Static mock counts for now — replace with real-time backend data when available
  const counts: Record<StatusKey, number> = {
    'awaiting-payment': 45,
    'awaiting-pickup': 62,
    'in-delivery': 89,
    'completed': 234,
    'issues': 8
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-8">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Order Flow Status</h2>
        <span className="text-xs text-gray-500">Static counts (mock)</span>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {ORDER_STATUSES.map(s => (
          <OrderStatusButton key={s.key} status={s} count={counts[s.key]} />
        ))}
      </div>
    </div>
  );
};

interface SystemHealthItemProps { service: string; status: string; icon: IconType; delay?: number }

const SystemHealthItem: React.FC<SystemHealthItemProps> = ({ service, status, icon: Icon, delay }) => (
  <div className="flex items-center justify-between p-3 animate-fade-in animate-preserve" style={{ animationDelay: `${delay ?? 0}ms` }}>
    <div className="flex items-center">
      <Icon className="w-5 h-5 text-gray-400 mr-3" />
      <span className="text-sm font-medium text-gray-900">{service}</span>
    </div>
    <StatusBadge status={status} />
  </div>
);

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days'>('today');

  return (
    <div className="flex-1 min-h-full bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 animate-slide-up animate-preserve">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Marketplace overview and system status</p>
            </div>
            <div className="flex gap-2">
              {(['today', '7days', '30days'] as const).map((filter, i) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors animate-fade-in animate-preserve ${
                    timeFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter === 'today' ? 'Today' : filter === '7days' ? 'Last 7 days' : 'Last 30 days'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        </div>

        {/* Order Flow Status (interactive) */}
        <OrderFlowPanel />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Demand / Order Velocity */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Velocity by Zone</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { zone: 'Ikeja', orders: 89, percentage: 85 },
                  { zone: 'Victoria Island', orders: 67, percentage: 65 },
                  { zone: 'Lekki', orders: 54, percentage: 52 },
                  { zone: 'Surulere', orders: 43, percentage: 41 },
                  { zone: 'Yaba', orders: 38, percentage: 36 }
                ].map((item) => (
                  <div key={item.zone}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{item.zone}</span>
                      <span className="text-sm text-gray-600">{item.orders} orders</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Health Monitor */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
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
                delay={80}
              />
              <SystemHealthItem
                service="Delivery Partner"
                status="Degraded"
                icon={MapPin}
                delay={160}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Alerts & Exceptions */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Alerts & Exceptions</h2>
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
                delay={80}
              />
              <AlertItem
                type="stock"
                message="Low stock alert: 'Fresh Tomatoes' in 2 merchant stores"
                time="1 hour ago"
                delay={160}
              />
              <AlertItem
                type="delivery"
                message="Delivery partner API response time elevated"
                time="2 hours ago"
                delay={240}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <ActionButton icon={Users} label="Verify New Merchant" variant="primary" delay={0} />
              <ActionButton icon={Megaphone} label="Create Broadcast" delay={80} />
              <ActionButton icon={Wallet} label="View Pending Payouts" delay={160} />
              <ActionButton icon={Download} label="Download Daily Report" delay={240} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
