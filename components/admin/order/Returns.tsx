'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw, Search, Filter, Check, XCircle, DollarSign, ChevronDown, AlertCircle, Clock, CheckCircle, Ban } from 'lucide-react';
import { refundService } from '@/services/refund.service';
import toast from 'react-hot-toast';

type StatusBadgeProps = { status: string };
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'REQUESTED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'REFUNDED':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'REQUESTED':
        return <Clock className="w-3 h-3" />;
          case 'APPROVED':
        return <CheckCircle className="w-3 h-3" />;
      case 'REJECTED':
        return <Ban className="w-3 h-3" />;
      case 'REFUNDED':
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

type ReturnItem = { 
  id: string; 
  orderNumber: string;
  customerPhone: string; 
  refundReason: string; 
  refundStatus: string; 
  refundAmount: number; 
  createdAt: string;
};

type ReturnRowProps = { returnItem: ReturnItem; onApprove: (id: string) => void; onReject: (id: string) => void; onRefund: (id: string) => void };
const ReturnRow: React.FC<ReturnRowProps> = ({ returnItem, onApprove, onReject, onRefund }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 text-sm font-medium text-gray-900">{returnItem.orderNumber}</td>
        <td className="px-6 py-4 text-sm text-gray-700">{returnItem.customerPhone}</td>
        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
          <div className="font-medium">{returnItem.refundReason}</div>
        </td>
        <td className="px-6 py-4">
          <StatusBadge status={returnItem.refundStatus} />
        </td>
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
          {returnItem.refundAmount > 0 ? `₦${returnItem.refundAmount.toLocaleString()}` : '—'}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">{new Date(returnItem.createdAt).toLocaleDateString()}</td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            {returnItem.refundStatus === 'REQUESTED' && (
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
            {returnItem.refundStatus === 'APPROVED' && (
              <button
                onClick={() => onRefund(returnItem.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <DollarSign className="w-3 h-3" />
                Trigger Refund
              </button>
            )}
            {(returnItem.refundStatus === 'REJECTED' || returnItem.refundStatus === 'REFUNDED') && (
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
  const [returns, setReturns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRefunds = async () => {
    setIsLoading(true);
    try {
      const response = await refundService.getAllRefunds(statusFilter);
      setReturns(response.data);
    } catch (error) {
      console.error('Failed to fetch refunds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, [statusFilter]);

  const handleApprove = async (orderId: string) => {
    try {
      await refundService.approveRefund(orderId);
      toast.error(`Return approved for ${orderId}`);
      fetchRefunds();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve refund');
    }
  };

  const handleReject = async (orderId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await refundService.rejectRefund(orderId, reason);
      toast.error(`Return rejected for ${orderId}`);
      fetchRefunds();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject refund');
    }
  };

  const handleRefund = async (orderId: string) => {
    if (!confirm(`Process refund for ${orderId}?`)) return;

    try {
      await refundService.processRefund(orderId);
      toast.errort(`Refund initiated for ${orderId}`);
      fetchRefunds();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process refund');
    }
  };

  const filteredReturns = returns.filter(returnItem => {
    const matchesSearch = returnItem.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        returnItem.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        returnItem.refundReason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || returnItem.refundStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const returnStatuses = ['All', 'REQUESTED', 'APPROVED', 'REJECTED', 'REFUNDED'];

  const totalRefundAmount = returns
    .filter(r => r.refundStatus === 'REFUNDED')
    .reduce((sum, r) => sum + (r.refundAmount || 0), 0);

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
            <p className="text-2xl font-bold text-gray-900">{returns.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {returns.filter(r => r.status === 'REQUESTED').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600">Approved</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {returns.filter(r => r.status === 'APPROVED').length}
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        Loading refunds...
                      </td>
                    </tr>
                  ) : filteredReturns.length > 0 ? (
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
          <span>Showing {filteredReturns.length} of {returns.length} returns</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-200 rounded-full border border-yellow-300"></div>
              <span>Requested</span>
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