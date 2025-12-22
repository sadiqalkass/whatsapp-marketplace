'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Package, Search, Filter, MoreVertical, Eye, X, AlertCircle, ChevronDown } from 'lucide-react';

// Mock Data for Active Orders
const mockActiveOrders = [
  { id: 'ORD-001', customer: 'John Doe', items: 3, amount: 45000, paymentStatus: 'Paid', status: 'In Delivery', created: '2 hours ago' },
  { id: 'ORD-002', customer: 'Jane Smith', items: 1, amount: 12500, paymentStatus: 'Awaiting Payment', status: 'Awaiting Payment', created: '4 hours ago' },
  { id: 'ORD-003', customer: 'Mike Johnson', items: 5, amount: 78000, paymentStatus: 'Paid', status: 'Awaiting Pickup', created: '6 hours ago' },
  { id: 'ORD-004', customer: 'Sarah Williams', items: 2, amount: 23000, paymentStatus: 'Paid', status: 'In Delivery', created: '1 day ago' },
  { id: 'ORD-005', customer: 'David Brown', items: 4, amount: 56000, paymentStatus: 'Paid', status: 'Awaiting Pickup', created: '1 day ago' },
  { id: 'ORD-006', customer: 'Emily Davis', items: 2, amount: 34000, paymentStatus: 'Paid', status: 'In Delivery', created: '2 days ago' },
  { id: 'ORD-007', customer: 'Chris Wilson', items: 1, amount: 15000, paymentStatus: 'Awaiting Payment', status: 'Awaiting Payment', created: '3 hours ago' },
  { id: 'ORD-008', customer: 'Lisa Anderson', items: 6, amount: 92000, paymentStatus: 'Paid', status: 'Awaiting Pickup', created: '5 hours ago' },
];

type StatusBadgeProps = { status: string; type?: 'order' | 'payment' };
const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'order' }) => {
  const getStyles = () => {
    if (type === 'payment') {
      switch (status) {
        case 'Paid':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'Awaiting Payment':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
    
    switch (status) {
      case 'In Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Awaiting Pickup':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Awaiting Payment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStyles()}`}>
      {status}
    </span>
  );
};

type ActionDropdownProps = { orderId: string; onAction: (orderId: string, action: string) => void };
const ActionDropdown: React.FC<ActionDropdownProps> = ({ orderId, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions: { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; action: string; danger?: boolean }[] = [
    { label: 'View Details', icon: Eye, action: 'view' },
    { label: 'Cancel Order', icon: X, action: 'cancel', danger: true },
    { label: 'Flag Issue', icon: AlertCircle, action: 'flag' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {actions.map((action) => (
              <button
                key={action.action}
                onClick={() => {
                  onAction(orderId, action.action);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                  action.danger ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

type Order = { id: string; customer: string; items: number; amount: number; paymentStatus: string; status: string; created: string };
type OrderRowProps = { order: Order; onAction: (orderId: string, action: string) => void };
const OrderRow: React.FC<OrderRowProps> = ({ order, onAction }) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
      <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
      <td className="px-6 py-4 text-sm text-gray-700">{order.items}</td>
      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
        ₦{order.amount.toLocaleString()}
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={order.paymentStatus} type="payment" />
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={order.status} type="order" />
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{order.created}</td>
      <td className="px-6 py-4">
        <ActionDropdown orderId={order.id} onAction={onAction} />
      </td>
    </tr>
  );
};

// Main Active Orders Component
const ActiveOrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    // Read URL params and set filters accordingly on mount / when params change
    if (!searchParams) return;

    const statusParam = searchParams.get('status');
    const paymentParam = searchParams.get('payment');

    if (paymentParam) {
      setPaymentFilter(paymentParam);
      // reset status filter when payment filter applied
      setStatusFilter('All');
    } else if (statusParam) {
      // Accept both key-style (awaiting-pickup) and human labels.
      const keyMap: Record<string, string> = {
        'awaiting-pickup': 'Awaiting Pickup',
        'in-delivery': 'In Delivery',
        'awaiting-payment': 'Awaiting Payment',
        'completed': 'Completed',
        'issues': 'Issues'
      };

      const mapped = keyMap[statusParam] ?? statusParam;
      setStatusFilter(mapped);
      setPaymentFilter('All');
    }
  }, [searchParams]);

  const handleAction = (orderId: string, action: string) => {
    console.log(`Action: ${action} on order: ${orderId}`);
    alert(`${action} action triggered for ${orderId}`);
  };

  const filteredOrders = mockActiveOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const orderStatuses = ['All', 'Awaiting Payment', 'Paid', 'Awaiting Pickup', 'In Delivery'];
  const paymentStatuses = ['All', 'Awaiting Payment', 'Paid'];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Active Orders</h1>
          </div>
          <p className="text-gray-600">Monitor and manage all ongoing orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{mockActiveOrders.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Awaiting Payment</p>
            <p className="text-2xl font-bold text-yellow-600">
              {mockActiveOrders.filter(o => o.paymentStatus === 'Awaiting Payment').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">In Delivery</p>
            <p className="text-2xl font-bold text-blue-600">
              {mockActiveOrders.filter(o => o.status === 'In Delivery').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Awaiting Pickup</p>
            <p className="text-2xl font-bold text-orange-600">
              {mockActiveOrders.filter(o => o.status === 'Awaiting Pickup').length}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {orderStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {paymentStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
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
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <OrderRow key={order.id} order={order} onAction={handleAction} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No orders found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredOrders.length} of {mockActiveOrders.length} orders
        </div>
      </div>
    </div>
  );
};

export default ActiveOrdersPage;