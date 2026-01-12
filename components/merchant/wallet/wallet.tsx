'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { walletService, type WalletData } from '@/services/wallet.service';
import { authService } from '@/services/auth.service';

export default function MerchantWalletPage() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const user = authService.getUser();
  const merchantId = user?.merchantId || '';
  console.log('User:', user);
  console.log('MerchantId:', merchantId);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() =>{
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const data = await walletService.getMerchantDashboard(merchantId);
        setWalletData(data);
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [merchantId]);

  if (loading) {
    return <div className='p-6'>Loading...</div>
  }

  if (!walletData) {
    return <div className="p-6">Failed to load wallet data</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getTransactionStatus = (type: string) => {
    if (type === 'CREDIT') {
      return { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400', icon: CheckCircle };
    }
    return { label: 'Withdrawal', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', icon: Clock };
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your earnings and payout history
          </p>
        </div>
        <button
          onClick={() => setShowWithdrawModal(true)}
          disabled={!walletData || walletData.availableBalance <= 0}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <DollarSign size={20} />
          Withdraw Funds
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-100 text-sm font-medium">Available Balance</span>
            <Wallet size={20} className="text-emerald-100" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {formatCurrency(walletData.availableBalance)}
          </div>
          <p className="text-emerald-100 text-xs">Ready for withdrawal</p>
        </div>

        {/* Pending Balance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending Balance</span>
            <Clock size={20} className="text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(walletData.pendingBalance)}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Processing orders</p>
        </div>

        {/* Total Earned */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Earned</span>
            <TrendingUp size={20} className="text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(walletData.totalEarnings)}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs">All time earnings</p>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payout History
          </h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Payout ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {walletData.recentTransactions.map((transaction) => {
                const statusConfig = getTransactionStatus(transaction.type);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <tr key={transaction.reference} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.reference}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
          {walletData.recentTransactions.map((transaction) => {
            const statusConfig = getTransactionStatus(transaction.type);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={transaction.reference} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
                      {transaction.reference}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                    <StatusIcon size={12} />
                    {statusConfig.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <DollarSign size={16} className="text-gray-400" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <WithdrawalModal
          availableBalance={walletData.availableBalance}
          merchantId={merchantId}
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={() => {
            setShowWithdrawModal(false);
            // Refresh wallet data
            walletService.getMerchantDashboard(merchantId).then(setWalletData);
          }}
          withdrawing={withdrawing}
          setWithdrawing={setWithdrawing}
        />
      )}
    </div>
  );
}

interface WithdrawalModalProps {
  availableBalance: number;
  merchantId: string;
  onClose: () => void;
  onSuccess: () => void;
  withdrawing: boolean;
  setWithdrawing: (val: boolean) => void;
}

function WithdrawalModal({ 
  availableBalance, 
  merchantId, 
  onClose, 
  onSuccess,
  withdrawing,
  setWithdrawing
}: WithdrawalModalProps) {
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount <= 0 || withdrawAmount > availableBalance) {
      setError('Invalid withdrawal amount');
      return;
    }

    if (!bankName || !accountNumber || !accountName) {
      setError('All fields are required');
      return;
    }

    try {
      setWithdrawing(true);
      await walletService.requestWithdrawal(merchantId, {
        amount: withdrawAmount,
        bankAccountName: accountName,
        bankAccountNumber: accountNumber,
        bankName
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Withdrawal failed');
    } finally {
      setWithdrawing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Withdraw Funds
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Available: {formatCurrency(availableBalance)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. GTBank, Access Bank"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="0123456789"
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Account Name
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={withdrawing}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={withdrawing}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {withdrawing ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}