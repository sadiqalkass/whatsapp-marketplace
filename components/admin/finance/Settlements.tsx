'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Check, X, AlertTriangle } from 'lucide-react';
import { SummaryCardProps, StatusBadgeProps, Merchant } from '@/Types/types';

const SummaryCard = ({ title, value, icon: Icon, className = '' }: SummaryCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
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
const mockSettlementsData = [
  {
    id: 'MERCH-001',
    merchant: 'Fashion Hub',
    availableBalance: '₦450,000',
    pendingBalance: '₦120,000',
    lastPayoutDate: '2024-12-15',
    payoutStatus: 'Paid',
    canPayout: true,
  },
  {
    id: 'MERCH-002',
    merchant: 'Tech World',
    availableBalance: '₦890,000',
    pendingBalance: '₦250,000',
    lastPayoutDate: '2024-12-10',
    payoutStatus: 'Pending',
    canPayout: true,
  },
  {
    id: 'MERCH-003',
    merchant: 'Food Mart',
    availableBalance: '₦125,000',
    pendingBalance: '₦45,000',
    lastPayoutDate: '2024-12-18',
    payoutStatus: 'Paid',
    canPayout: true,
  },
  {
    id: 'MERCH-004',
    merchant: 'Electronics Plus',
    availableBalance: '₦1,200,000',
    pendingBalance: '₦500,000',
    lastPayoutDate: '2024-12-12',
    payoutStatus: 'Pending',
    canPayout: true,
  },
  {
    id: 'MERCH-005',
    merchant: 'Book Store',
    availableBalance: '₦75,000',
    pendingBalance: '₦30,000',
    lastPayoutDate: '2024-12-08',
    payoutStatus: 'Failed',
    canPayout: true,
  },
];

export default function SettlementsPage() {
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [payoutType, setPayoutType] = useState<'bulk' | 'individual' | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  const handleSelectMerchant = (merchantId: string) => {
    setSelectedMerchants(prev => 
      prev.includes(merchantId) 
        ? prev.filter(id => id !== merchantId)
        : [...prev, merchantId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMerchants.length === filteredData.length) {
      setSelectedMerchants([]);
    } else {
      setSelectedMerchants(filteredData.map(m => m.id));
    }
  };

  const handleBulkPayout = () => {
    setPayoutType('bulk');
    setShowConfirmModal(true);
  };

  const handleIndividualPayout = (merchant: Merchant) => {
    setPayoutType('individual');
    setSelectedMerchant(merchant);
    setShowConfirmModal(true);
  };

  const confirmPayout = () => {
    if (payoutType === 'bulk') {
      alert(`Processing payout for ${selectedMerchants.length} merchants`);
      setSelectedMerchants([]);
    } else {
      alert(`Processing payout for ${selectedMerchant && (
          <span className="font-semibold">{selectedMerchant.merchant}</span>
        )}"
      `);
    }
    setShowConfirmModal(false);
    setPayoutType(null);
    setSelectedMerchant(null);
  };

  const getStatusType = (status: string) => {
    if (status === 'Paid') return 'success';
    if (status === 'Pending') return 'warning';
    if (status === 'Failed') return 'error';
    return 'neutral';
  };

  const filteredData = mockSettlementsData.filter(merchant => {
    if (filter === 'all') return true;
    return merchant.payoutStatus.toLowerCase() === filter;
  });

  const totalAvailable = mockSettlementsData.reduce((sum, m) => {
    const amount = parseInt(m.availableBalance.replace(/[₦,]/g, ''));
    return sum + amount;
  }, 0);

  const totalPending = mockSettlementsData.reduce((sum, m) => {
    const amount = parseInt(m.pendingBalance.replace(/[₦,]/g, ''));
    return sum + amount;
  }, 0);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settlements Management</h1>
          <p className="text-gray-600 mt-2">Process payouts and manage merchant settlements</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total Available Balance"
            value={`₦${totalAvailable.toLocaleString()}`}
            icon={DollarSign}
          />
          <SummaryCard
            title="Total Pending Balance"
            value={`₦${totalPending.toLocaleString()}`}
            icon={TrendingUp}
          />
          <SummaryCard
            title="Merchants Ready"
            value={filteredData.filter(m => m.canPayout).length}
            icon={Calendar}
          />
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('paid')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'paid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setFilter('failed')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'failed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Failed
              </button>
            </div>
            <button
              onClick={handleBulkPayout}
              disabled={selectedMerchants.length === 0}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Process Bulk Payout ({selectedMerchants.length})
            </button>
          </div>
        </div>

        {/* Settlements Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedMerchants.length === filteredData.length && filteredData.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Payout Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedMerchants.includes(merchant.id)}
                        onChange={() => handleSelectMerchant(merchant.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {merchant.merchant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {merchant.availableBalance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {merchant.pendingBalance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {merchant.lastPayoutDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge 
                        status={merchant.payoutStatus} 
                        type={getStatusType(merchant.payoutStatus)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleIndividualPayout(merchant)}
                        disabled={!merchant.canPayout}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Process Payout
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Confirm Payout</h2>
              </div>
              <div className="mb-6">
                {payoutType === 'bulk' ? (
                  <p className="text-gray-700">
                    Are you sure you want to process payout for <span className="font-semibold">{selectedMerchants.length} merchant(s)</span>? This action cannot be undone.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      Are you sure you want to process payout for <span className="font-semibold">{selectedMerchant?.merchant}</span>?
                    </p>
                    <p className="text-sm text-gray-600">
                      Amount: <span className="font-semibold">{selectedMerchant?.availableBalance}</span>
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setPayoutType(null);
                    setSelectedMerchant(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={confirmPayout}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Confirm Payout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}