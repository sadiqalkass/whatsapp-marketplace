'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Download, 
  Unlock,
  DollarSign,
  RefreshCw,
  Eye,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  BarChart3,
  MoreVertical,
  X,
} from 'lucide-react';
import { walletService } from '@/services/wallet.service';
import type { MerchantWallet, PlatformRevenue, Transaction as WalletTransaction, AdjustmentRequest } from '@/services/wallet.service';
import toast from 'react-hot-toast';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
};

const mockTransactions: WalletTransaction[] = [
  { id: 'txn1', type: 'DEPOSIT', amount: 50000, balanceAfter: 50000, reference: 'PAY-123456', description: 'Card deposit', createdAt: '2024-12-23T10:30:00Z', metadata: { status: 'SUCCESS' } },
  { id: 'txn2', type: 'PURCHASE', amount: -12000, balanceAfter: 38000, reference: 'ORD-789012', description: 'Grocery order', createdAt: '2024-12-23T09:15:00Z', metadata: { status: 'SUCCESS' } },
  { id: 'txn3', type: 'REFUND', amount: 5000, balanceAfter: 43000, reference: 'ORD-789012', description: 'Order refund', createdAt: '2024-12-22T16:20:00Z', metadata: { status: 'SUCCESS' } },
  { id: 'txn4', type: 'WITHDRAWAL', amount: -100000, balanceAfter: -57000, reference: 'WD-345678', description: 'Merchant payout', createdAt: '2024-12-22T14:00:00Z', metadata: { status: 'PENDING' } },
  { id: 'txn5', type: 'ADJUSTMENT', amount: 15000, balanceAfter: -42000, reference: 'ADJ-001', description: 'Promotional bonus', createdAt: '2024-12-21T11:45:00Z', metadata: { status: 'SUCCESS' } },
];

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  loading?: boolean;
}

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

export default function WalletManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ledger'>('overview');
  const [loading, setLoading] = useState(false);
  const [platformRevenue, setPlatformRevenue] = useState<PlatformRevenue | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const revenue = await walletService.getPlatformRevenue();
        setPlatformRevenue(revenue);
      } catch (error) {
        console.error('Failed to fetch platform revenue', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6">
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
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && <WalletOverview loading={loading} platformRevenue={platformRevenue} />}
        {activeTab === 'ledger' && <WalletLedger />}
      </div>
    </div>
  );
}

function WalletOverview({ loading, platformRevenue }: { loading: boolean, platformRevenue: PlatformRevenue | null }) {

  return (
    <div className="space-y-6">
      {/* Liquidity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Platform Revenue"
          value={platformRevenue ? formatCurrency(platformRevenue.totalRevenue) : '₦0'}
          icon={Wallet}
          color="blue"
          loading={loading}
        />
        <SummaryCard
          title="Total Payouts"
          value={platformRevenue ? formatCurrency(platformRevenue.totalPayouts) : '₦0'}
          icon={ArrowUpRight}
          color="orange"
          loading={loading}
        />
        <SummaryCard
          title="Current Balance"
          value={platformRevenue ? formatCurrency(platformRevenue.currentBalance) : '₦0'}
          icon={DollarSign}
          color="green"
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

      {/* Platform Transactions */}
      <PlatformTransactions />
    </div>
  );
}

function PlatformTransactions() {
  const [txns, setTxns] = useState<WalletTransaction[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTxns = async () => {
      setLoading(true);
      try {
        const data = await walletService.getPlatformTransactions(10);
        setTxns(data || []);
      } catch (error) {
        console.error('Failed to fetch platform transactions', error);
        toast.error('Failed to load platform transactions');
        setTxns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTxns();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Platform Transactions</h2>
        <button
          onClick={async () => {
            setLoading(true);
            try {
              const data = await walletService.getPlatformTransactions(10);
              setTxns(data || []);
            } catch (err) {
              console.error(err);
              toast.error('Failed to refresh');
            } finally {
              setLoading(false);
            }
          }}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        ) : !txns || txns.length === 0 ? (
          <div className="text-gray-500">No platform transactions found</div>
        ) : (
          <div className="space-y-3">
            {txns.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="text-sm text-gray-900">{t.type}</div>
                <div className={`text-sm font-semibold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {t.amount >= 0 ? '+' : '-'}{formatCurrency(Math.abs(t.amount))}
                </div>
                <div className="text-sm text-gray-500">{new Date(t.createdAt).toLocaleString()}</div>
                <div className="text-sm text-blue-600">{t.reference}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function WalletLedger() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<MerchantWallet | null>(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'balance' | 'createdAt' | 'transactionCount'>('balance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;
  const [wallets, setWallets] = useState<MerchantWallet[]>([]);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const data = await walletService.getAllMerchantWallets();
      setWallets(data || []);
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
      toast.error('Failed to load wallets');
      setWallets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);
  const filteredWallets = (wallets || []).filter((w) => {
    const matchesSearch = w.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.merchantName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
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

  const totalPages = Math.max(1, Math.ceil(filteredWallets.length / itemsPerPage));

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
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
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {loading ? 'Loading wallets...' : `Showing ${paginatedWallets.length} of ${filteredWallets.length} wallets`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!selectedWallet) {
                  toast('Select a wallet by clicking "View" on a row to adjust', { icon: 'ℹ️' });
                  return;
                }
                setShowAdjustmentModal(true);
              }}
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
                      <div className="text-sm text-gray-500">{wallet.merchantName}</div>
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
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <Unlock className="w-3 h-3 mr-1" /> Active
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{wallet.transactionCount}</div>
                    <div className="text-xs text-gray-500">Total transactions</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{wallet.updatedAt ? new Date(wallet.updatedAt).toLocaleString() : new Date(wallet.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(wallet.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedWallet(wallet)}
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
          wallet={selectedWallet}
          onClose={() => setSelectedWallet(null)}
        />
      )}

      {/* Manual Adjustment Modal */}
      {showAdjustmentModal && (
        <ManualAdjustmentModal
          wallet={selectedWallet}
          onClose={() => setShowAdjustmentModal(false)}
          onSuccess={() => fetchWallets()}
        />
      )}
    </div>
  );
}

type UITransaction = WalletTransaction & { status?: string; adminName?: string; };

function TransactionHistoryModal({ wallet, onClose }: { wallet: MerchantWallet; onClose: () => void }) {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const data = await walletService.getMerchantTransactions(wallet.merchantId || wallet.id, 200);
        setTransactions(data || []);
      } catch (error) {
        console.error('Failed to fetch transactions', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [wallet]);

  const filteredTransactions = transactions.filter(txn => {
    if (filterType !== 'all' && txn.type !== filterType) return false;
    if (filterStatus !== 'all') {
      const t = txn as UITransaction;
      const status = t.status || (txn.metadata && (txn.metadata.status || txn.metadata.transferStatus));
      if (!status || String(status) !== filterStatus) return false;
    }
    return true;
  });

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
              {wallet?.phone} • {wallet?.merchantName} • Current Balance: {formatCurrency(wallet?.balance || 0)}
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
                  filteredTransactions.map((txn) => {
                    const t = txn as UITransaction;
                    const statusLabel = t.status || (txn.metadata && (txn.metadata.status || txn.metadata.transferStatus)) || 'COMPLETED';
                    return (
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
                          {t.adminName && (
                            <div className="text-xs text-gray-500 mt-1">By: {t.adminName}</div>
                          )}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${txn.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.amount >= 0 ? '+' : '-'}{formatCurrency(Math.abs(txn.amount))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            statusLabel === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                            statusLabel === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <a href="#" className="text-blue-600 hover:text-blue-900">
                            {txn.reference}
                          </a>
                        </td>
                      </tr>
                    );
                  })
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

function ManualAdjustmentModal({ wallet, onClose, onSuccess }: { wallet?: MerchantWallet | null; onClose: () => void; onSuccess?: () => void }) {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!wallet) return toast.error('No wallet selected');
    if (!amount || amount === 0) return toast.error('Please enter an amount');

    setSubmitting(true);
    try {
      const payload: AdjustmentRequest = { amount, reason };
      await walletService.adjustMerchantBalance(wallet.merchantId || wallet.id, payload);
      toast.success('Adjustment applied');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Adjustment failed', err);
      toast.error('Failed to apply adjustment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Manual Balance Adjustment</h2>
          <div className="text-sm text-gray-600">{wallet ? `${wallet.merchantName} • ${wallet.phone}` : ''}</div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (use negative for debit)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ManualAdjustmentModal };
