'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Bell, Clock, TrendingDown, AlertCircle, CheckCircle, Filter, ChevronDown, XCircle, RefreshCw } from 'lucide-react';
import { abandonedOrderService } from '@/services/abadonedOrder.service';

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
  };
};

type AbandonedOrder = {
  id: string;
  orderNumber: string;
  customerPhone: string;
  customerEmail: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  paymentExpiresAt: string | null;
  timeRemaining: number;
  isExpired: boolean;
};

type StatusBadgeProps = { isExpired: boolean; timeRemaining: number };
const StatusBadge: React.FC<StatusBadgeProps> = ({ isExpired, timeRemaining }) => {
  if (isExpired) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 border border-red-200 rounded-full text-xs font-medium">
        <XCircle className="w-3 h-3" />
        Expired
      </div>
    );
  }

  if (timeRemaining < 10) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-full text-xs font-medium">
        <AlertCircle className="w-3 h-3" />
        Expiring Soon
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-xs font-medium">
      <CheckCircle className="w-3 h-3" />
      Active
    </div>
  );
};

type OrderRowProps = {
  order: AbandonedOrder;
  onResendLink: (id: string) => void;
  onCancelOrder: (id: string) => void;
  onExtendTimeout: (id: string) => void;
};

const OrderRow: React.FC<OrderRowProps> = ({ order, onResendLink, onCancelOrder, onExtendTimeout }) => {
  const [expanded, setExpanded] = useState(false);

  const getUrgencyColor = () => {
    if (order.isExpired) return 'text-red-600';
    if (order.timeRemaining < 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatTimeRemaining = () => {
    if (order.isExpired) return 'Expired';
    if (order.timeRemaining < 60) return `${order.timeRemaining}m`;
    const hours = Math.floor(order.timeRemaining / 60);
    const mins = order.timeRemaining % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <>
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <div>
            <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
            <p className="text-xs text-gray-500">{order.customerPhone}</p>
          </div>
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {order.items.length} item{order.items.length > 1 ? 's' : ''}
          </button>
        </td>
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
          ₦{order.totalAmount.toLocaleString()}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${getUrgencyColor()}`} />
            <span className={`text-sm font-medium ${getUrgencyColor()}`}>
              {formatTimeRemaining()}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <StatusBadge isExpired={order.isExpired} timeRemaining={order.timeRemaining} />
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onResendLink(order.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
              title="Resend payment link"
            >
              <Bell className="w-3 h-3" />
              Resend
            </button>
            {!order.isExpired && (
              <button
                onClick={() => onExtendTimeout(order.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                title="Extend timeout"
              >
                <Clock className="w-3 h-3" />
                Extend
              </button>
            )}
            <button
              onClick={() => onCancelOrder(order.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
              title="Cancel order"
            >
              <XCircle className="w-3 h-3" />
              Cancel
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Row - Items Detail */}
      {expanded && (
        <tr className="bg-blue-50">
          <td colSpan={6} className="px-6 py-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700 mb-2">Order Items:</p>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm bg-white rounded px-3 py-2 border border-blue-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{item.product.name}</span>
                    <span className="text-gray-500">× {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const AbandonedOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<AbandonedOrder[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    expiredOrders: 0,
    activeOrders: 0,
    totalValue: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersResponse, statsResponse] = await Promise.all([
        abandonedOrderService.getAbandonedOrders(),
        abandonedOrderService.getStats(),
      ]);

      setOrders(ordersResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch abandoned orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Refresh every 30 seconds to update time remaining
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleResendLink = async (orderId: string) => {
    try {
      await abandonedOrderService.resendPaymentLink(orderId);
      alert('Payment link resent successfully!');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to resend payment link');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await abandonedOrderService.cancelOrder(orderId);
      alert('Order cancelled successfully');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleExtendTimeout = async (orderId: string) => {
    try {
      await abandonedOrderService.extendTimeout(orderId, 30);
      alert('Timeout extended by 30 minutes');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to extend timeout');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      order.items.some((item) => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter === 'Active') matchesStatus = !order.isExpired;
    if (statusFilter === 'Expired') matchesStatus = order.isExpired;
    if (statusFilter === 'Expiring Soon') matchesStatus = !order.isExpired && order.timeRemaining < 10;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-orange-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Abandoned Orders</h1>
                <p className="text-gray-600">Recover unpaid orders and reduce drop-offs</p>
              </div>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <p className="text-sm text-gray-600">Potential Revenue</p>
            </div>
            <p className="text-2xl font-bold text-red-600">₦{stats.totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600">Active Orders</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.activeOrders}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-gray-600">Expired</p>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.expiredOrders}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number, phone, or items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Time Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
                      <p>Loading abandoned orders...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      onResendLink={handleResendLink}
                      onCancelOrder={handleCancelOrder}
                      onExtendTimeout={handleExtendTimeout}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No abandoned orders found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredOrders.length} of {orders.length} abandoned orders
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-200 rounded-full border border-blue-300"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-200 rounded-full border border-yellow-300"></div>
              <span>Expiring Soon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-200 rounded-full border border-red-300"></div>
              <span>Expired</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbandonedOrdersPage;