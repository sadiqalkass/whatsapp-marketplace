'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Download, 
  Lock, 
  Unlock,
  DollarSign,
  RefreshCw,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  PlusCircle,
  MoreVertical,
  Loader2,
  AlertTriangle,
  Check,
  X,
  Clock
} from 'lucide-react';

// ============================================
// TYPES & INTERFACES
// ============================================

interface WalletData {
  id: string;
  phone: string;
  balance: number;
  currency: string;
  status: 'ACTIVE' | 'LOCKED' | 'FROZEN';
  lastTransaction: string;
  createdAt: string;
  ownerName?: string;
  tier?: string;
  transactionCount: number;
}

interface TransactionData {
  id: string;
  type: 'DEPOSIT' | 'PURCHASE' | 'REFUND' | 'WITHDRAWAL' | 'ADJUSTMENT';
  amount: number;
  ref: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
  description?: string;
  adminName?: string;
  walletId: string;
}

interface WithdrawalRequest {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantPhone: string;
  amount: number;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankCode: string;
  };
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING';
  reason?: string;
  processedAt?: string;
  processedBy?: string;
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

interface LiquidityStats {
  totalBalance: number;
  deposits24h: number;
  depositsTrend: number;
  withdrawalsPending: number;
  withdrawalsTrend: number;
  activeWallets: number;
  activeWalletsTrend: number;
  lockedWallets: number;
  totalTransactions24h: number;
  averageTransaction: number;
}

interface SummaryCardProps {
  title: string;
  value: string;
  icon: any;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  loading?: boolean;
}

// ============================================
// MOCK DATA (Replace with API calls)
// ============================================

const mockLiquidityStats: LiquidityStats = {
  totalBalance: 12450000,
  deposits24h: 450000,
  depositsTrend: 12.5,
  withdrawalsPending: 280000,
  withdrawalsTrend: -5.2,
  activeWallets: 1250,
  activeWalletsTrend: 8.3,
  lockedWallets: 12,
  totalTransactions24h: 342,
  averageTransaction: 14500
};

const mockWallets: WalletData[] = [
  { id: '1', phone: '+2348012345678', balance: 145000, currency: 'NGN', status: 'ACTIVE', lastTransaction: '2024-12-23', createdAt: '2024-01-15', ownerName: 'John Doe', tier: 'Gold', transactionCount: 45 },
  { id: '2', phone: '+2348087654321', balance: 89500, currency: 'NGN', status: 'ACTIVE', lastTransaction: '2024-12-22', createdAt: '2024-02-10', ownerName: 'Jane Smith', tier: 'Silver', transactionCount: 32 },
  { id: '3', phone: '+2348098765432', balance: 0, currency: 'NGN', status: 'LOCKED', lastTransaction: '2024-11-15', createdAt: '2024-03-05', transactionCount: 12 },
  { id: '4', phone: '+2348076543210', balance: 320000, currency: 'NGN', status: 'ACTIVE', lastTransaction: '2024-12-23', createdAt: '2024-01-20', ownerName: 'Robert Johnson', tier: 'Platinum', transactionCount: 89 },
  { id: '5', phone: '+2348065432109', balance: 1500000, currency: 'NGN', status: 'ACTIVE', lastTransaction: '2024-12-23', createdAt: '2024-01-10', ownerName: 'Merchant Pro', tier: 'Business', transactionCount: 156 },
  { id: '6', phone: '+2348054321098', balance: 45000, currency: 'NGN', status: 'ACTIVE', lastTransaction: '2024-12-22', createdAt: '2024-03-15', transactionCount: 8 },
  { id: '7', phone: '+2348043210987', balance: 780000, currency: 'NGN', status: 'FROZEN', lastTransaction: '2024-12-21', createdAt: '2024-02-05', ownerName: 'Sarah Williams', tier: 'Gold', transactionCount: 67 },
];

const mockTransactions: TransactionData[] = [
  { id: 'txn1', type: 'DEPOSIT', amount: 50000, ref: 'PAY-123456', status: 'SUCCESS', createdAt: '2024-12-23 10:30', description: 'Card deposit', walletId: '1' },
  { id: 'txn2', type: 'PURCHASE', amount: -12000, ref: 'ORD-789012', status: 'SUCCESS', createdAt: '2024-12-23 09:15', description: 'Grocery order', walletId: '1' },
  { id: 'txn3', type: 'REFUND', amount: 5000, ref: 'ORD-789012', status: 'SUCCESS', createdAt: '2024-12-22 16:20', description: 'Order refund', walletId: '1' },
  { id: 'txn4', type: 'WITHDRAWAL', amount: -100000, ref: 'WD-345678', status: 'PENDING', createdAt: '2024-12-22 14:00', description: 'Merchant payout', walletId: '5' },
  { id: 'txn5', type: 'ADJUSTMENT', amount: 15000, ref: 'ADJ-001', status: 'SUCCESS', createdAt: '2024-12-21 11:45', description: 'Promotional bonus', adminName: 'Admin User', walletId: '2' },
  { id: 'txn6', type: 'DEPOSIT', amount: 200000, ref: 'PAY-789012', status: 'FAILED', createdAt: '2024-12-21 10:15', description: 'Failed bank transfer', walletId: '4' },
];

const mockWithdrawals: WithdrawalRequest[] = [
  { 
    id: 'wd1', 
    merchantId: 'm1',
    merchantName: 'Fashion Hub', 
    merchantPhone: '+2348012345678',
    amount: 500000, 
    bankDetails: { 
      accountName: 'Fashion Hub Ltd', 
      accountNumber: '0123456789', 
      bankName: 'GTBank',
      bankCode: '058'
    },
    requestedAt: '2024-12-23 08:00',
    status: 'PENDING',
    kycStatus: 'VERIFIED'
  },
  { 
    id: 'wd2', 
    merchantId: 'm2',
    merchantName: 'Tech World', 
    merchantPhone: '+2348087654321',
    amount: 320000, 
    bankDetails: { 
      accountName: 'Tech World Nigeria', 
      accountNumber: '9876543210', 
      bankName: 'Access Bank',
      bankCode: '044'
    },
    requestedAt: '2024-12-22 15:30',
    status: 'PENDING',
    kycStatus: 'VERIFIED'
  },
  { 
    id: 'wd3', 
    merchantId: 'm3',
    merchantName: 'Food Mart', 
    merchantPhone: '+2348098765432',
    amount: 150000, 
    bankDetails: { 
      accountName: 'Food Mart Enterprises', 
      accountNumber: '5678901234', 
      bankName: 'Zenith Bank',
      bankCode: '057'
    },
    requestedAt: '2024-12-22 10:15',
    status: 'APPROVED',
    processedAt: '2024-12-23 09:30',
    processedBy: 'Admin User',
    kycStatus: 'VERIFIED'
  },
  { 
    id: 'wd4', 
    merchantId: 'm4',
    merchantName: 'Electronics Plus', 
    merchantPhone: '+2348076543210',
    amount: 750000, 
    bankDetails: { 
      accountName: 'Electronics Plus Ltd', 
      accountNumber: '246813579', 
      bankName: 'First Bank',
      bankCode: '011'
    },
    requestedAt: '2024-12-21 14:45',
    status: 'REJECTED',
    reason: 'Incomplete KYC documentation',
    processedAt: '2024-12-22 11:20',
    processedBy: 'Admin User',
    kycStatus: 'PENDING'
  },
];

// ============================================
// COMPONENTS
// ============================================

const SummaryCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className = '',
  color = 'blue',
  loading = false
}: SummaryCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600'
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gray-200 rounded-lg w-12 h-12"></div>
          <div className="bg-gray-200 rounded w-16 h-4"></div>
        </div>
        <div className="space-y-2">
          <div className="bg-gray-200 rounded h-3 w-24"></div>
          <div className="bg-gray-200 rounded h-6 w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trend.value}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

// ============================================
// MAIN WALLET MANAGEMENT PAGE
// ============================================

export default function WalletManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ledger' | 'withdrawals'>('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<LiquidityStats | null>(null);

  // Simulate API call for stats
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(mockLiquidityStats);
      setLoading(false);
    };
    
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const refreshData = async () => {
    setLoading(true);
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Virtual Wallet Management</h1>
            <p className="text-gray-600">Monitor platform liquidity, user wallets, and merchant payouts</p>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600 bg-blue-50 rounded-t-lg'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-3 font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'ledger'
                  ? 'border-blue-600 text-blue-600 bg-blue-50 rounded-t-lg'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg'
              }`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Wallet Ledger
              </div>
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`px-4 py-3 font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'withdrawals'
                  ? 'border-blue-600 text-blue-600 bg-blue-50 rounded-t-lg'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg'
              }`}
            >
              <div className="flex items-center gap-2 relative">
                <DollarSign className="w-4 h-4" />
                Withdrawals
                {mockWithdrawals.filter(w => w.status === 'PENDING').length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {mockWithdrawals.filter(w => w.status === 'PENDING').length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && <WalletOverview stats={stats} loading={loading} />}
        {activeTab === 'ledger' && <WalletLedger />}
        {activeTab === 'withdrawals' && <WithdrawalManager />}
      </div>
    </div>
  );
}

// ============================================
// WALLET OVERVIEW TAB
// ============================================

function WalletOverview({ stats, loading }: { stats: LiquidityStats | null, loading: boolean }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Liquidity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Platform Balance"
          value={stats ? formatCurrency(stats.totalBalance) : '₦0'}
          icon={Wallet}
          color="blue"
          trend={stats ? { value: `${stats.depositsTrend}%`, isPositive: stats.depositsTrend > 0 } : undefined}
          loading={loading}
        />
        <SummaryCard
          title="Deposits (24h)"
          value={stats ? formatCurrency(stats.deposits24h) : '₦0'}
          icon={ArrowDownRight}
          color="green"
          trend={stats ? { value: `${stats.depositsTrend}%`, isPositive: stats.depositsTrend > 0 } : undefined}
          loading={loading}
        />
        <SummaryCard
          title="Withdrawals Pending"
          value={stats ? formatCurrency(stats.withdrawalsPending) : '₦0'}
          icon={ArrowUpRight}
          color="orange"
          trend={stats ? { value: `${stats.withdrawalsTrend}%`, isPositive: stats.withdrawalsTrend > 0 } : undefined}
          loading={loading}
        />
        <SummaryCard
          title="Active Wallets"
          value={stats ? stats.activeWallets.toLocaleString() : '0'}
          icon={Users}
          color="purple"
          trend={stats ? { value: `${stats.activeWalletsTrend}%`, isPositive: stats.activeWalletsTrend > 0 } : undefined}
          loading={loading}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Locked/Frozen Wallets"
          value={stats ? stats.lockedWallets.toString() : '0'}
          icon={Lock}
          color="red"
          loading={loading}
        />
        <SummaryCard
          title="Transactions (24h)"
          value={stats ? stats.totalTransactions24h.toString() : '0'}
          icon={DollarSign}
          color="green"
          loading={loading}
        />
        <SummaryCard
          title="Avg Transaction"
          value={stats ? formatCurrency(stats.averageTransaction) : '₦0'}
          icon={BarChart3}
          color="blue"
          loading={loading}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <Eye className="w-4 h-4" />
            View All
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockTransactions.slice(0, 5).map((txn) => (
              <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-3 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    txn.type === 'DEPOSIT' || txn.type === 'REFUND' || txn.type === 'ADJUSTMENT'
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-red-50 text-red-600'
                  }`}>
                    {txn.type === 'DEPOSIT' || txn.type === 'REFUND' || txn.type === 'ADJUSTMENT' ? (
                      <ArrowDownRight className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{txn.type}</p>
                    <p className="text-sm text-gray-500">{txn.ref} • {txn.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    txn.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {txn.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(txn.amount))}
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      txn.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                      txn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {txn.status}
                    </span>
                    <p className="text-sm text-gray-500">{txn.createdAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// WALLET LEDGER TAB
// ============================================

function WalletLedger() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'LOCKED' | 'FROZEN'>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'balance' | 'createdAt' | 'transactionCount'>('balance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredWallets = mockWallets.filter(wallet => {
    const matchesSearch = wallet.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wallet.ownerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || wallet.status === statusFilter;
    const matchesTier = tierFilter === 'all' || wallet.tier === tierFilter;
    return matchesSearch && matchesStatus && matchesTier;
  }).sort((a, b) => {
    if (sortBy === 'balance') {
      return sortOrder === 'desc' ? b.balance - a.balance : a.balance - b.balance;
    } else if (sortBy === 'transactionCount') {
      return sortOrder === 'desc' ? b.transactionCount - a.transactionCount : a.transactionCount - b.transactionCount;
    } else {
      return sortOrder === 'desc' 
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  const paginatedWallets = filteredWallets.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredWallets.length / itemsPerPage);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by phone number or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="LOCKED">Locked</option>
              <option value="FROZEN">Frozen</option>
            </select>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Tiers</option>
              <option value="Business">Business</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {paginatedWallets.length} of {filteredWallets.length} wallets
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAdjustmentModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Manual Adjustment
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Wallets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('balance')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Phone / Name
                    {sortBy === 'balance' && (
                      <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('balance')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Balance
                    {sortBy === 'balance' && (
                      <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status / Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('transactionCount')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Transactions
                    {sortBy === 'transactionCount' && (
                      <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedWallets.map((wallet) => (
                <tr key={wallet.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{wallet.phone}</div>
                      {wallet.ownerName && (
                        <div className="text-sm text-gray-500">{wallet.ownerName}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(wallet.balance)}
                    </div>
                    <div className="text-xs text-gray-500">NGN</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        wallet.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : wallet.status === 'LOCKED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {wallet.status === 'ACTIVE' ? (
                          <><Unlock className="w-3 h-3 mr-1" /> Active</>
                        ) : wallet.status === 'LOCKED' ? (
                          <><Lock className="w-3 h-3 mr-1" /> Locked</>
                        ) : (
                          <><Shield className="w-3 h-3 mr-1" /> Frozen</>
                        )}
                      </span>
                      {wallet.tier && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {wallet.tier}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{wallet.transactionCount}</div>
                    <div className="text-xs text-gray-500">Total transactions</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{wallet.lastTransaction}</div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(wallet.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedWallet(wallet.id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction History Modal */}
      {selectedWallet && (
        <TransactionHistoryModal
          walletId={selectedWallet}
          onClose={() => setSelectedWallet(null)}
        />
      )}

      {/* Manual Adjustment Modal */}
      {showAdjustmentModal && (
        <ManualAdjustmentModal onClose={() => setShowAdjustmentModal(false)} />
      )}
    </div>
  );
}

// ============================================
// WITHDRAWAL MANAGER TAB
// ============================================

function WithdrawalManager() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING'>('all');
  const [kycFilter, setKycFilter] = useState<'all' | 'VERIFIED' | 'PENDING' | 'REJECTED'>('all');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredWithdrawals = mockWithdrawals.filter(w => {
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    const matchesKyc = kycFilter === 'all' || w.kycStatus === kycFilter;
    return matchesStatus && matchesKyc;
  });

  const pendingWithdrawals = mockWithdrawals.filter(w => w.status === 'PENDING');
  const totalPendingAmount = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0);

  const handleApprove = async (id: string) => {
    setProcessing(id);
    // TODO: API call to approve withdrawal
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Withdrawal ${id} approved successfully!`);
    setProcessing(null);
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      setProcessing(id);
      // TODO: API call to reject withdrawal
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Withdrawal ${id} rejected: ${reason}`);
      setProcessing(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKycColor = (status: string) => {
    switch(status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Pending Withdrawals Summary */}
      {pendingWithdrawals.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Pending Withdrawal Requests</h3>
                <p className="text-sm text-gray-600">
                  {pendingWithdrawals.length} requests • {formatCurrency(totalPendingAmount)} total
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Process All
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">KYC Status</label>
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All KYC Status</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Merchant Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank Details
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
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{withdrawal.merchantName}</div>
                      <div className="text-sm text-gray-500">{withdrawal.merchantPhone}</div>
                      <div className="text-xs text-gray-400">ID: {withdrawal.merchantId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(withdrawal.amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Requested: {withdrawal.requestedAt}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{withdrawal.bankDetails.accountName}</div>
                      <div className="text-gray-600">{withdrawal.bankDetails.accountNumber}</div>
                      <div className="text-gray-500">{withdrawal.bankDetails.bankName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getKycColor(withdrawal.kycStatus)}`}>
                        KYC: {withdrawal.kycStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {withdrawal.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(withdrawal.id)}
                            disabled={processing === withdrawal.id}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            {processing === withdrawal.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(withdrawal.id)}
                            disabled={processing === withdrawal.id}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedWithdrawal(withdrawal.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TRANSACTION HISTORY MODAL
// ============================================

function TransactionHistoryModal({ walletId, onClose }: { walletId: string; onClose: () => void }) {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      // TODO: Replace with API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const walletTransactions = mockTransactions.filter(txn => txn.walletId === walletId);
      setTransactions(walletTransactions);
      setLoading(false);
    };
    
    fetchTransactions();
  }, [walletId]);

  const filteredTransactions = transactions.filter(txn => {
    if (filterType !== 'all' && txn.type !== filterType) return false;
    if (filterStatus !== 'all' && txn.status !== filterStatus) return false;
    return true;
  });

  const wallet = mockWallets.find(w => w.id === walletId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'DEPOSIT':
      case 'REFUND':
      case 'ADJUSTMENT':
        return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            <p className="text-sm text-gray-600">
              {wallet?.phone} • {wallet?.ownerName} • Current Balance: {formatCurrency(wallet?.balance || 0)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="DEPOSIT">Deposits</option>
                <option value="PURCHASE">Purchases</option>
                <option value="REFUND">Refunds</option>
                <option value="WITHDRAWAL">Withdrawals</option>
                <option value="ADJUSTMENT">Adjustments</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-500">No transactions found</div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(txn.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(txn.type)}
                          <span className="font-medium">{txn.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {txn.description}
                        {txn.adminName && (
                          <div className="text-xs text-gray-500 mt-1">By: {txn.adminName}</div>
                        )}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        txn.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {txn.amount > 0 ? '+' : '-'}{formatCurrency(txn.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          txn.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                          txn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a href="#" className="text-blue-600 hover:text-blue-900">
                          {txn.ref}
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {filteredTransactions.length} transactions
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Export CSV
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MANUAL ADJUSTMENT MODAL (Placeholder for completion)
// ============================================

function ManualAdjustmentModal({ onClose }: { onClose: () => void }) {
  // This would be the full implementation as shown in previous response
  // For brevity, showing a simple placeholder
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Manual Balance Adjustment</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">Manual adjustment functionality would go here.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}