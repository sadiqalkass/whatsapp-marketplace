'use client';

import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { orderManagementService } from '@/services/orderManagement.service';
import toast from 'react-hot-toast';

// Types based on your API response
interface ApiOrder {
  id: string;
  orderNumber?: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price?: number;
  }>;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  orderStatus: 'Processing' | 'Ready for Pickup' | 'In Delivery' | 'Delivered' | 'Cancelled' | 'Awaiting Payment';
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// Local order type that matches your existing structure
type Order = {
  id: string;
  items: string;
  quantity: number;
  status: 'Pending' | 'Accepted' | 'Ready' | 'Completed' | 'Rejected';
  pickupTime: string;
  orderDate: string;
  orderNotes: string;
  apiData: ApiOrder; // Store original API data
};

type OrderStatus = 'Pending' | 'Accepted' | 'Ready' | 'Completed' | 'Rejected';

// Helper function to format API data to local format
const formatOrder = (apiOrder: ApiOrder): Order => {
  // Map API status to local merchant status
  const getMerchantStatus = (apiStatus: string): OrderStatus => {
    switch (apiStatus) {
      case 'Processing':
      case 'Awaiting Payment':
        return 'Pending';
      case 'Ready for Pickup':
        return 'Accepted';
      case 'In Delivery':
        return 'Ready';
      case 'Delivered':
        return 'Completed';
      case 'Cancelled':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  // Format items list
  const formatItems = (items: Array<{name: string; quantity: number}>): string => {
    return items.map(item => 
      item.quantity > 1 ? `${item.name} (x${item.quantity})` : item.name
    ).join(', ');
  };

  // Calculate total quantity
  const totalQuantity = apiOrder.items.reduce((sum, item) => sum + item.quantity, 0);

  // Generate pickup time (you might want to adjust this logic)
  const pickupTime = new Date(apiOrder.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Format order date
  const orderDate = new Date(apiOrder.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return {
    id: apiOrder.orderNumber || apiOrder.id,
    items: formatItems(apiOrder.items),
    quantity: totalQuantity,
    status: getMerchantStatus(apiOrder.orderStatus),
    pickupTime: pickupTime,
    orderDate: orderDate,
    orderNotes: apiOrder.notes || '',
    apiData: apiOrder,
  };
};

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [apiOrders, setApiOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Fetch merchant orders on component mount
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderManagementService.getMerchantOrders();
      setApiOrders(data);
      setOrders(data.map(formatOrder));
    } catch (error) {
      console.error('Failed to fetch merchant orders:', error);
      toast.error('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return { 
          label: 'Pending', 
          color: 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
          icon: Clock 
        };
      case 'Accepted':
        return { 
          label: 'Accepted', 
          color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
          icon: Package 
        };
      case 'Ready':
        return { 
          label: 'Ready', 
          color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
          icon: CheckCircle 
        };
      case 'Completed':
        return { 
          label: 'Completed', 
          color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
          icon: CheckCircle 
        };
      case 'Rejected':
        return { 
          label: 'Rejected', 
          color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
          icon: XCircle
        };
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    // Find the corresponding API order
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Map local status to API status
    const getApiStatus = (status: OrderStatus): string => {
      switch (status) {
        case 'Accepted':
          return 'Ready for Pickup';
        case 'Ready':
          return 'Ready for Pickup'; // Or 'In Delivery' depending on your workflow
        case 'Completed':
          return 'Delivered';
        case 'Rejected':
          return 'Cancelled';
        default:
          return 'Processing';
      }
    };

    const apiStatus = getApiStatus(newStatus);
    
    try {
      setUpdatingOrderId(orderId);
      
      // Update order status via API
      await orderManagementService.updateMerchantOrderStatus(order.apiData.id, apiStatus);
      
      // Refresh the orders list
      setRefreshing(true);
      await fetchOrders();
      
      // Show success message based on status
      const statusMessages = {
        'Accepted': 'Order preparation started',
        'Ready': 'Order marked as ready for pickup',
        'Completed': 'Order marked as completed',
        'Rejected': 'Order rejected'
      };
      
      if (statusMessages[newStatus]) {
        toast.success(statusMessages[newStatus]);
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status. Please try again.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
  };

  const newOrdersCount = orders.filter(o => o.status === 'Pending').length;

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage incoming orders and prepare for pickup
            </p>
          </div>
          <div className="flex items-center gap-3">
            {newOrdersCount > 0 && (
              <span className="hidden sm:inline-flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg">
                {newOrdersCount} New {newOrdersCount === 1 ? 'Order' : 'Orders'}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No orders found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              New orders will appear here when customers place them
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Pickup Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {order.items}
                        </span>
                        {order.orderNotes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Note: {order.orderNotes}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {order.pickupTime}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {order.orderDate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {order.status === 'Pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Accepted')}
                            disabled={updatingOrderId === order.id}
                            className="px-3 py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {updatingOrderId === order.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              'Start Preparing'
                            )}
                          </button>
                        )}
                        {order.status === 'Accepted' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Ready')}
                            disabled={updatingOrderId === order.id}
                            className="px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {updatingOrderId === order.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              'Mark Ready'
                            )}
                          </button>
                        )}
                        {order.status === 'Ready' && (
                          <span className="px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            Awaiting Pickup
                          </span>
                        )}
                        {(order.status === 'Completed' || order.status === 'Rejected') && (
                          <span className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                            {order.status}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No orders found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              New orders will appear here when customers place them
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                      {order.id}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {order.items}
                    </p>
                    {order.orderNotes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Note: {order.orderNotes}
                      </p>
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                    <StatusIcon size={12} />
                    {statusConfig.label}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-100 dark:border-gray-700 mb-3">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Quantity</span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                      {order.quantity} {order.quantity === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Pickup Time</span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                      {order.pickupTime}
                    </p>
                  </div>
                </div>

                {/* Order Date */}
                <div className="mb-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Order Date</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                    {order.orderDate}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {order.status === 'Pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Accepted')}
                      disabled={updatingOrderId === order.id}
                      className="flex-1 px-4 py-2.5 text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {updatingOrderId === order.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Start Preparing'
                      )}
                    </button>
                  )}
                  {order.status === 'Accepted' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Ready')}
                      disabled={updatingOrderId === order.id}
                      className="flex-1 px-4 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {updatingOrderId === order.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Mark Ready'
                      )}
                    </button>
                  )}
                  {order.status === 'Ready' && (
                    <div className="flex-1 px-4 py-2.5 text-sm font-medium text-center text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      Awaiting Pickup
                    </div>
                  )}
                  {(order.status === 'Completed' || order.status === 'Rejected') && (
                    <div className="flex-1 px-4 py-2.5 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {order.status}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}