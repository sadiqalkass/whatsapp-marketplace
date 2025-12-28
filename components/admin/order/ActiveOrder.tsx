'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Package, Search, Filter, MoreVertical, Eye, X, AlertCircle, ChevronDown, Truck, CheckCircle, Clock, PackageOpen, RefreshCw, UserPlus } from 'lucide-react';

// Mock Data for Active Orders
const mockActiveOrders = [
  { id: 'ORD-001', customer: 'John Doe', items: 3, amount: 45000, paymentStatus: 'Paid', status: 'Processing', created: '2 hours ago', courier: null },
  { id: 'ORD-002', customer: 'Jane Smith', items: 1, amount: 12500, paymentStatus: 'Awaiting Payment', status: 'Awaiting Payment', created: '4 hours ago', courier: null },
  { id: 'ORD-003', customer: 'Mike Johnson', items: 5, amount: 78000, paymentStatus: 'Paid', status: 'Processing', created: '6 hours ago', courier: null },
  { id: 'ORD-004', customer: 'Sarah Williams', items: 2, amount: 23000, paymentStatus: 'Paid', status: 'Ready for Pickup', created: '1 day ago', courier: 'Speedy Logistics' },
  { id: 'ORD-005', customer: 'David Brown', items: 4, amount: 56000, paymentStatus: 'Paid', status: 'In Delivery', created: '1 day ago', courier: 'CityRiders Express' },
  { id: 'ORD-006', customer: 'Emily Davis', items: 2, amount: 34000, paymentStatus: 'Paid', status: 'Ready for Pickup', created: '2 days ago', courier: null },
  { id: 'ORD-007', customer: 'Chris Wilson', items: 1, amount: 15000, paymentStatus: 'Awaiting Payment', status: 'Awaiting Payment', created: '3 hours ago', courier: null },
  { id: 'ORD-008', customer: 'Lisa Anderson', items: 6, amount: 92000, paymentStatus: 'Paid', status: 'Delivered', created: '5 hours ago', courier: 'Swift Logistics' },
];

// Mock courier options
const availableCouriers = [
  { id: 'C001', name: 'Speedy Logistics', rating: 4.8, activeDeliveries: 3 },
  { id: 'C002', name: 'CityRiders Express', rating: 4.5, activeDeliveries: 5 },
  { id: 'C003', name: 'Swift Logistics', rating: 4.9, activeDeliveries: 2 },
  { id: 'C004', name: 'Urban Deliveries', rating: 4.3, activeDeliveries: 4 },
  { id: 'C005', name: 'Metro Couriers', rating: 4.6, activeDeliveries: 6 },
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
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Ready for Pickup':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'In Delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Awaiting Payment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
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

type ActionDropdownProps = { 
  orderId: string; 
  currentStatus: string;
  hasCourier: boolean;
  onAction: (orderId: string, action: string, data?: any) => void 
};
const ActionDropdown: React.FC<ActionDropdownProps> = ({ orderId, currentStatus, hasCourier, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getAvailableActions = () => {
    const baseActions = [
      { label: 'View Details', icon: Eye, action: 'view' },
      { label: 'Flag Issue', icon: AlertCircle, action: 'flag' },
      { label: 'Cancel Order', icon: X, action: 'cancel', danger: true },
    ];

    const statusActions = [];
    
    // Add status-specific actions
    switch (currentStatus) {
      case 'Processing':
        statusActions.push(
          { label: 'Mark as Ready for Pickup', icon: PackageOpen, action: 'status:ready' },
          { label: 'Assign Courier', icon: Truck, action: 'assign_courier' }
        );
        break;
      case 'Ready for Pickup':
        statusActions.push(
          { label: 'Mark as In Delivery', icon: Truck, action: 'status:delivery' },
          { label: 'Re-assign Courier', icon: UserPlus, action: 'assign_courier' }
        );
        break;
      case 'In Delivery':
        statusActions.push(
          { label: 'Mark as Delivered', icon: CheckCircle, action: 'status:delivered' },
          { label: 'Update Delivery Status', icon: RefreshCw, action: 'update_delivery' }
        );
        break;
      case 'Awaiting Payment':
        statusActions.push(
          { label: 'Mark Payment as Paid', icon: CheckCircle, action: 'payment:paid' },
          { label: 'Process Order', icon: Package, action: 'status:processing' }
        );
        break;
    }

    return [...statusActions, ...baseActions];
  };

  const actions = getAvailableActions();

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
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
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

type CourierModalProps = {
  orderId: string;
  orderDetails: string;
  currentCourier: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (courierName: string) => void;
};

const CourierModal: React.FC<CourierModalProps> = ({
  orderId,
  orderDetails,
  currentCourier,
  isOpen,
  onClose,
  onAssign
}) => {
  const [selectedCourier, setSelectedCourier] = useState<string>(currentCourier || '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Assign Courier</h3>
        <p className="text-sm text-gray-600 mb-4">
          Assign a courier for order <strong>{orderId}</strong> - {orderDetails}
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Courier Service
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableCouriers.map((courier) => (
              <label
                key={courier.id}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedCourier === courier.name 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="courier"
                  value={courier.name}
                  checked={selectedCourier === courier.name}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{courier.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>⭐ {courier.rating}/5</span>
                    <span>•</span>
                    <span>{courier.activeDeliveries} active deliveries</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedCourier) {
                onAssign(selectedCourier);
                onClose();
              }
            }}
            disabled={!selectedCourier}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCourier
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Assign Courier
          </button>
        </div>
      </div>
    </div>
  );
};

type StatusUpdateModalProps = {
  orderId: string;
  orderDetails: string;
  currentStatus: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (newStatus: string, notes?: string) => void;
};

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  orderId,
  orderDetails,
  currentStatus,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const statusOptions = [
    { value: 'Processing', label: 'Processing', icon: Clock },
    { value: 'Ready for Pickup', label: 'Ready for Pickup', icon: PackageOpen },
    { value: 'In Delivery', label: 'In Delivery', icon: Truck },
    { value: 'Delivered', label: 'Delivered', icon: CheckCircle },
    { value: 'Cancelled', label: 'Cancelled', icon: X },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Update Order Status</h3>
        <p className="text-sm text-gray-600 mb-4">
          Update status for order <strong>{orderId}</strong> - {orderDetails}
          <br />
          <span className="text-gray-500">Current: {currentStatus}</span>
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            New Status
          </label>
          <div className="grid grid-cols-2 gap-3">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => onUpdate(status.value, notes)}
                className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-colors ${
                  status.value === currentStatus
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <status.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{status.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this status change..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onUpdate(currentStatus, notes)}
            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};

type Order = { 
  id: string; 
  customer: string; 
  items: number; 
  amount: number; 
  paymentStatus: string; 
  status: string; 
  created: string;
  courier: string | null;
};

type OrderRowProps = { 
  order: Order; 
  onAction: (orderId: string, action: string, data?: any) => void 
};
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
      <td className="px-6 py-4">
        {order.courier ? (
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{order.courier}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Not assigned</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{order.created}</td>
      <td className="px-6 py-4">
        <ActionDropdown 
          orderId={order.id} 
          currentStatus={order.status}
          hasCourier={!!order.courier}
          onAction={onAction} 
        />
      </td>
    </tr>
  );
};

// Main Active Orders Component
const ActiveOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockActiveOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal states
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const statusParam = searchParams.get('status');
    const paymentParam = searchParams.get('payment');

    if (paymentParam) {
      setPaymentFilter(paymentParam);
      setStatusFilter('All');
    } else if (statusParam) {
      const keyMap: Record<string, string> = {
        'awaiting-pickup': 'Ready for Pickup',
        'in-delivery': 'In Delivery',
        'awaiting-payment': 'Awaiting Payment',
        'processing': 'Processing',
        'delivered': 'Delivered'
      };

      const mapped = keyMap[statusParam] ?? statusParam;
      setStatusFilter(mapped);
      setPaymentFilter('All');
    }
  }, [searchParams]);

  const handleAction = (orderId: string, action: string, data?: any) => {
    console.log(`Action: ${action} on order: ${orderId}`, data);
    
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    switch (action) {
      case 'view':
        alert(`Viewing details for ${orderId}`);
        break;

      case 'cancel':
        if (confirm(`Cancel order ${orderId}?`)) {
          setOrders(prev => prev.map(o => 
            o.id === orderId ? { ...o, status: 'Cancelled' } : o
          ));
        }
        break;

      case 'assign_courier':
        setSelectedOrder(order);
        setShowCourierModal(true);
        break;

      case 'status:ready':
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status: 'Ready for Pickup' } : o
        ));
        alert(`Order ${orderId} marked as Ready for Pickup`);
        break;

      case 'status:delivery':
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status: 'In Delivery' } : o
        ));
        alert(`Order ${orderId} marked as In Delivery`);
        break;

      case 'status:delivered':
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status: 'Delivered' } : o
        ));
        alert(`Order ${orderId} marked as Delivered`);
        break;

      case 'status:processing':
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status: 'Processing', paymentStatus: 'Paid' } : o
        ));
        alert(`Order ${orderId} marked as Processing and payment confirmed`);
        break;

      case 'payment:paid':
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, paymentStatus: 'Paid' } : o
        ));
        alert(`Payment marked as Paid for ${orderId}`);
        break;

      case 'update_delivery':
        setSelectedOrder(order);
        setShowStatusModal(true);
        break;

      case 'flag':
        alert(`Flagged order ${orderId} for review`);
        break;

      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  const handleAssignCourier = (courierName: string) => {
    if (selectedOrder) {
      setOrders(prev => prev.map(o => 
        o.id === selectedOrder.id ? { 
          ...o, 
          courier: courierName,
          status: o.status === 'Processing' ? 'Ready for Pickup' : o.status
        } : o
      ));
      alert(`Assigned ${courierName} to order ${selectedOrder.id}`);
    }
  };

  const handleStatusUpdate = (newStatus: string, notes?: string) => {
    if (selectedOrder) {
      setOrders(prev => prev.map(o => 
        o.id === selectedOrder.id ? { ...o, status: newStatus } : o
      ));
      console.log(`Updated status for ${selectedOrder.id} to ${newStatus}`, { notes });
      alert(`Status updated to ${newStatus} for order ${selectedOrder.id}`);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const orderStatuses = ['All', 'Processing', 'Ready for Pickup', 'In Delivery', 'Delivered', 'Awaiting Payment', 'Cancelled'];
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
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Awaiting Processing</p>
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'Processing').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Ready for Pickup</p>
            <p className="text-2xl font-bold text-orange-600">
              {orders.filter(o => o.status === 'Ready for Pickup').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">In Delivery</p>
            <p className="text-2xl font-bold text-purple-600">
              {orders.filter(o => o.status === 'In Delivery').length}
            </p>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Quick Actions</h4>
              <p className="text-sm text-blue-700">Process orders efficiently with these shortcuts</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const readyOrders = orders.filter(o => o.status === 'Ready for Pickup' && !o.courier);
                  if (readyOrders.length > 0) {
                    alert(`You have ${readyOrders.length} orders ready for courier assignment`);
                  } else {
                    alert('No orders currently need courier assignment');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Assign Couriers
              </button>
              <button
                onClick={() => {
                  const processingOrders = orders.filter(o => o.status === 'Processing');
                  if (processingOrders.length > 0) {
                    setOrders(prev => prev.map(o => 
                      o.status === 'Processing' ? { ...o, status: 'Ready for Pickup' } : o
                    ));
                    alert(`Marked ${processingOrders.length} orders as Ready for Pickup`);
                  } else {
                    alert('No orders in Processing status');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Mark All as Ready
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or courier..."
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
                    Courier
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
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
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
          Showing {filteredOrders.length} of {orders.length} orders
          {filteredOrders.length > 0 && (
            <span className="ml-4">
              • {filteredOrders.filter(o => o.status === 'Ready for Pickup').length} ready for pickup
              • {filteredOrders.filter(o => o.status === 'Processing').length} processing
              • {filteredOrders.filter(o => !o.courier).length} need courier
            </span>
          )}
        </div>

        {/* Modals */}
        {selectedOrder && (
          <>
            <CourierModal
              orderId={selectedOrder.id}
              orderDetails={`${selectedOrder.items} items for ${selectedOrder.customer}`}
              currentCourier={selectedOrder.courier}
              isOpen={showCourierModal}
              onClose={() => {
                setShowCourierModal(false);
                setSelectedOrder(null);
              }}
              onAssign={handleAssignCourier}
            />

            <StatusUpdateModal
              orderId={selectedOrder.id}
              orderDetails={`${selectedOrder.items} items for ${selectedOrder.customer}`}
              currentStatus={selectedOrder.status}
              isOpen={showStatusModal}
              onClose={() => {
                setShowStatusModal(false);
                setSelectedOrder(null);
              }}
              onUpdate={handleStatusUpdate}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ActiveOrdersPage;