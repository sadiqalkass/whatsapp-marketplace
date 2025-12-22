'use client';

import React, { useState } from 'react';
import { DollarSign, Package, Clock, Eye, AlertCircle } from 'lucide-react';
import { SummaryCardProps, EscrowOrder, StatusBadgeProps } from '@/Types/types';

const SummaryCard = ({ title, value, icon: Icon, trend, className = '' }: SummaryCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className="bg-blue-50 p-3 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status, type = 'neutral' }: StatusBadgeProps) => {
  const colors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type]}`}>
      {status}
    </span>
  );
};

// Mock Data
const mockEscrowData = [
  {
    orderId: 'ORD-2024-001',
    customer: 'John Doe',
    merchant: 'Fashion Hub',
    orderAmount: '₦45,000',
    heldAmount: '₦45,000',
    deliveryStatus: 'Delivered',
    escrowStatus: 'Held',
    createdDate: '2024-12-18',
    daysInEscrow: 2,
  },
  {
    orderId: 'ORD-2024-002',
    customer: 'Jane Smith',
    merchant: 'Tech World',
    orderAmount: '₦120,000',
    heldAmount: '₦120,000',
    deliveryStatus: 'In Transit',
    escrowStatus: 'Held',
    createdDate: '2024-12-15',
    daysInEscrow: 5,
  },
  {
    orderId: 'ORD-2024-003',
    customer: 'Mike Johnson',
    merchant: 'Food Mart',
    orderAmount: '₦8,500',
    heldAmount: '₦8,500',
    deliveryStatus: 'Pending',
    escrowStatus: 'Held',
    createdDate: '2024-12-08',
    daysInEscrow: 12,
  },
  {
    orderId: 'ORD-2024-004',
    customer: 'Sarah Williams',
    merchant: 'Electronics Plus',
    orderAmount: '₦250,000',
    heldAmount: '₦250,000',
    deliveryStatus: 'Delivered',
    escrowStatus: 'Held',
    createdDate: '2024-12-17',
    daysInEscrow: 3,
  },
  {
    orderId: 'ORD-2024-005',
    customer: 'David Brown',
    merchant: 'Fashion Hub',
    orderAmount: '₦32,000',
    heldAmount: '₦32,000',
    deliveryStatus: 'Delivered',
    escrowStatus: 'Held',
    createdDate: '2024-12-10',
    daysInEscrow: 10,
  },
];

export default function EscrowPage() {
  const [selectedOrder, setSelectedOrder] = useState<EscrowOrder | null>(null);

  const getEscrowAgeColor = (days: number) => {
    if (days >= 10) return 'text-red-600 font-semibold';
    if (days >= 5) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
  };

  const getDeliveryStatusType = (status: string) => {
    if (status === 'Delivered') return 'success';
    if (status === 'In Transit') return 'info';
    return 'warning';
  };

  const totalInEscrow = '₦2,455,500';
  const ordersInEscrow = mockEscrowData.length;
  const oldestEscrow = Math.max(...mockEscrowData.map(d => d.daysInEscrow));

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Escrow Management</h1>
          <p className="text-gray-600 mt-2">Track and manage funds held in escrow</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total Funds in Escrow"
            value={totalInEscrow}
            icon={DollarSign}
            trend={{ value: '12% from last week', isPositive: true }}
          />
          <SummaryCard
            title="Orders in Escrow"
            value={ordersInEscrow}
            icon={Package}
            trend={{ value: '8% from last week', isPositive: false }}
          />
          <SummaryCard
            title="Oldest Escrow Age"
            value={`${oldestEscrow} days`}
            icon={Clock}
          />
        </div>

        {/* Alert for Aging Escrows */}
        {oldestEscrow >= 10 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Aging Escrows Detected</p>
              <p className="text-sm text-yellow-700 mt-1">
                You have {mockEscrowData.filter(d => d.daysInEscrow >= 10).length} escrow(s) older than 10 days. Please review and take action.
              </p>
            </div>
          </div>
        )}

        {/* Escrow Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Escrow Details</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Held Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Escrow Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age (Days)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockEscrowData.map((escrow, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {escrow.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {escrow.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {escrow.merchant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {escrow.orderAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {escrow.heldAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge 
                        status={escrow.deliveryStatus} 
                        type={getDeliveryStatusType(escrow.deliveryStatus)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={escrow.escrowStatus} type="warning" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getEscrowAgeColor(escrow.daysInEscrow)}>
                        {escrow.daysInEscrow}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedOrder(escrow)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="text-base font-semibold text-gray-900">{selectedOrder.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="text-base font-semibold text-gray-900">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Merchant</p>
                    <p className="text-base font-semibold text-gray-900">{selectedOrder.merchant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Amount</p>
                    <p className="text-base font-semibold text-gray-900">{selectedOrder.orderAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Held Amount</p>
                    <p className="text-base font-semibold text-gray-900">{selectedOrder.heldAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Status</p>
                    <StatusBadge 
                      status={selectedOrder.deliveryStatus} 
                      type={getDeliveryStatusType(selectedOrder.deliveryStatus)}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Escrow Status</p>
                    <StatusBadge status={selectedOrder.escrowStatus} type="warning" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created Date</p>
                    <p className="text-base font-semibold text-gray-900">{selectedOrder.createdDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Days in Escrow</p>
                    <p className={`text-base font-semibold ${getEscrowAgeColor(selectedOrder.daysInEscrow)}`}>
                      {selectedOrder.daysInEscrow} days
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}