'use client';

import React, { useState } from 'react';
import { RotateCcw, Search, Filter, Check, XCircle, DollarSign, ChevronDown, AlertCircle, Clock, CheckCircle, Ban } from 'lucide-react';

// Mock Data for Returns
const mockReturns = [
  { 
    id: 'ORD-012', 
    customer: 'Samuel Ojo', 
    reason: 'Item damaged during delivery', 
    status: 'Pending', 
    refundAmount: 34000, 
    dateOpened: '2 hours ago',
    details: 'Customer reports broken screen on arrival'
  },
  { 
    id: 'ORD-009', 
    customer: 'Grace Adeyemi', 
    reason: 'Wrong item delivered', 
    status: 'Approved', 
    refundAmount: 18500, 
    dateOpened: '1 day ago',
    details: 'Ordered blue dress, received red dress'
  },
  { 
    id: 'ORD-015', 
    customer: 'Ibrahim Musa', 
    reason: 'Item not as described', 
    status: 'Pending', 
    refundAmount: 52000, 
    dateOpened: '3 hours ago',
    details: 'Product specifications do not match listing'
  },
  { 
    id: 'ORD-011', 
    customer: 'Blessing Okoro', 
    reason: 'Changed mind', 
    status: 'Rejected', 
    refundAmount: 0, 
    dateOpened: '2 days ago',
    details: 'Return window expired'
  },
  { 
    id: 'ORD-007', 
    customer: 'Tunde Bakare', 
    reason: 'Defective product', 
    status: 'Refunded', 
    refundAmount: 67000, 
    dateOpened: '5 days ago',
    details: 'Laptop not turning on'
  },
  { 
    id: 'ORD-014', 
    customer: 'Amina Hassan', 
    reason: 'Size too small', 
    status: 'Approved', 
    refundAmount: 15000, 
    dateOpened: '1 day ago',
    details: 'Customer needs larger size'
  },
  { 
    id: 'ORD-016', 
    customer: 'Peter Obidi', 
    reason: 'Item arrived late', 
    status: 'Pending', 
    refundAmount: 23000, 
    dateOpened: '5 hours ago',
    details: 'Delivery delayed by 2 weeks'
  },
];

type StatusBadgeProps = { status: string };
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Refunded':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-3 h-3" />;
          case 'Approved':
        return <CheckCircle className="w-3 h-3" />;
      case 'Rejected':
        return <Ban className="w-3 h-3" />;
      case 'Refunded':
        return <DollarSign className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1 ${getStyles()}`}>
      {getIcon()}
      {status}
    </span>
  );
};

type ReturnItem = { id: string; customer: string; reason: string; status: string; refundAmount: number; dateOpened: string; details: string };

type ReturnRowProps = { returnItem: ReturnItem; onApprove: (id: string) => void; onReject: (id: string) => void; onRefund: (id: string) => void };
const ReturnRow: React.FC<ReturnRowProps> = ({ returnItem, onApprove, onReject, onRefund }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 text-sm font-medium text-gray-900">{returnItem.id}</td>
        <td className="px-6 py-4 text-sm text-gray-700">{returnItem.customer}</td>
        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-left hover:text-blue-600 transition-colors"
          >
            <div className="font-medium">{returnItem.reason}</div>
            <div className="text-xs text-gray-500 mt-1">{returnItem.details}</div>
          </button>
        </td>
        <td className="px-6 py-4">
          <StatusBadge status={returnItem.status} />
        </td>
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
          {returnItem.refundAmount > 0 ? `₦${returnItem.refundAmount.toLocaleString()}` : '—'}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">{returnItem.dateOpened}</td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            {returnItem.status === 'Pending' && (
              <>
                <button
                  onClick={() => onApprove(returnItem.id)}
                  className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                  title="Approve Return"
                >
                  <Check className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                </button>
                <button
                  onClick={() => onReject(returnItem.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                  title="Reject Return"
                >
                  <XCircle className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                </button>
              </>
            )}
            {returnItem.status === 'Approved' && (
              <button
                onClick={() => onRefund(returnItem.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <DollarSign className="w-3 h-3" />
                Trigger Refund
              </button>
            )}
            {(returnItem.status === 'Rejected' || returnItem.status === 'Refunded') && (
              <span className="text-xs text-gray-400 italic">No actions available</span>
            )}
          </div>
        </td>
      </tr>
  );
};

// Main Returns Page Component
const ReturnsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const handleApprove = (orderId: string) => {
    console.log(`Approving return for order: ${orderId}`);
    alert(`Return approved for ${orderId}`);
  };

  const handleReject = (orderId: string) => {
    console.log(`Rejecting return for order: ${orderId}`);
    alert(`Return rejected for ${orderId}`);
  };

  const handleRefund = (orderId: string) => {
    console.log(`Triggering refund for order: ${orderId}`);
    alert(`Refund initiated for ${orderId}`);
  };

  const filteredReturns = mockReturns.filter(returnItem => {
    const matchesSearch = returnItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || returnItem.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const returnStatuses = ['All', 'Pending', 'Approved', 'Rejected', 'Refunded'];

  const totalRefundAmount = mockReturns
    .filter(r => r.status === 'Refunded')
    .reduce((sum, r) => sum + r.refundAmount, 0);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <RotateCcw className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Returns & Refunds</h1>
          </div>
          <p className="text-gray-600">Handle disputes, returns, and refund requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-gray-600" />
              <p className="text-sm text-gray-600">Total Returns</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockReturns.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {mockReturns.filter(r => r.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600">Approved</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {mockReturns.filter(r => r.status === 'Approved').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600">Total Refunded</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₦{totalRefundAmount.toLocaleString()}
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
                placeholder="Search by order ID, customer, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Return Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {returnStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Returns Table */}
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
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Refund Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date Opened
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns.length > 0 ? (
                  filteredReturns.map(returnItem => (
                    <ReturnRow 
                      key={returnItem.id} 
                      returnItem={returnItem}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onRefund={handleRefund}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No return requests found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredReturns.length} of {mockReturns.length} returns</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-200 rounded-full border border-yellow-300"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-200 rounded-full border border-blue-300"></div>
              <span>Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-200 rounded-full border border-red-300"></div>
              <span>Rejected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 rounded-full border border-green-300"></div>
              <span>Refunded</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;