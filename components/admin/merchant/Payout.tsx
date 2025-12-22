// app/merchants/payouts/page.tsx
'use client';

import { useState } from 'react';
import { Search, Wallet, Clock, CheckCircle, XCircle, Send, AlertCircle } from 'lucide-react';

type PayoutStatus = 'Pending' | 'Paid' | 'Failed';

interface Payout {
  id: string;
  merchantId: string;
  merchantName: string;
  availableBalance: number;
  pendingBalance: number;
  lastPayoutDate: string;
  lastPayoutAmount: number;
  status: PayoutStatus;
}

const mockPayouts: Payout[] = [
  {
    id: 'PO001',
    merchantId: 'M001',
    merchantName: 'Fashion Hub Store',
    availableBalance: 45000,
    pendingBalance: 12000,
    lastPayoutDate: '2024-12-15',
    lastPayoutAmount: 38000,
    status: 'Paid',
  },
  {
    id: 'PO002',
    merchantId: 'M002',
    merchantName: 'TechGear Nigeria',
    availableBalance: 120000,
    pendingBalance: 25000,
    lastPayoutDate: '2024-12-18',
    lastPayoutAmount: 95000,
    status: 'Pending',
  },
  {
    id: 'PO003',
    merchantId: 'M004',
    merchantName: 'Home Essentials Plus',
    availableBalance: 67000,
    pendingBalance: 8000,
    lastPayoutDate: '2024-12-16',
    lastPayoutAmount: 54000,
    status: 'Paid',
  },
  {
    id: 'PO004',
    merchantId: 'M005',
    merchantName: 'Beauty & Care Shop',
    availableBalance: 34500,
    pendingBalance: 15000,
    lastPayoutDate: '2024-12-10',
    lastPayoutAmount: 28000,
    status: 'Failed',
  },
  {
    id: 'PO005',
    merchantId: 'M006',
    merchantName: 'Sports Arena Store',
    availableBalance: 89000,
    pendingBalance: 18000,
    lastPayoutDate: '2024-12-14',
    lastPayoutAmount: 72000,
    status: 'Pending',
  },
  {
    id: 'PO006',
    merchantId: 'M007',
    merchantName: 'Books & Stationery Co',
    availableBalance: 23000,
    pendingBalance: 5000,
    lastPayoutDate: '2024-12-17',
    lastPayoutAmount: 19000,
    status: 'Paid',
  },
];

const StatusBadge = ({ status }: { status: PayoutStatus }) => {
  const config = {
    Pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: Clock,
    },
    Paid: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: CheckCircle,
    },
    Failed: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: XCircle,
    },
  };

  const { bg, text, border, icon: Icon } = config[status];

  return (
    <span className={`${bg} ${text} ${border} px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1.5`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

const EscrowSummary = ({ payouts }: { payouts: Payout[] }) => {
  const totalAvailable = payouts.reduce((sum, p) => sum + p.availableBalance, 0);
  const totalPending = payouts.reduce((sum, p) => sum + p.pendingBalance, 0);
  const totalInEscrow = totalAvailable + totalPending;

  const summaryCards = [
    {
      label: 'Total in Escrow',
      amount: totalInEscrow,
      icon: Wallet,
      gradient: 'from-purple-500 to-purple-600',
      iconColor: 'text-white',
    },
    {
      label: 'Available for Payout',
      amount: totalAvailable,
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600',
      iconColor: 'text-white',
    },
    {
      label: 'Pending Clearance',
      amount: totalPending,
      icon: Clock,
      gradient: 'from-yellow-500 to-yellow-600',
      iconColor: 'text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.gradient} rounded-xl p-6 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium opacity-95">{card.label}</span>
              <Icon className={`w-5 h-5 ${card.iconColor} opacity-90`} />
            </div>
            <p className="text-3xl font-bold">₦{card.amount.toLocaleString()}</p>
          </div>
        );
      })}
    </div>
  );
};

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState(mockPayouts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PayoutStatus>('all');
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch = payout.merchantName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelection = (id: string) => {
    setSelectedPayouts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPayouts.length === filteredPayouts.length) {
      setSelectedPayouts([]);
    } else {
      setSelectedPayouts(filteredPayouts.map((p) => p.id));
    }
  };

  const processSinglePayout = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Paid' as PayoutStatus,
              lastPayoutDate: today,
              lastPayoutAmount: p.availableBalance,
              availableBalance: 0,
            }
          : p
      )
    );
  };

  const processBulkPayouts = () => {
    const today = new Date().toISOString().split('T')[0];
    setPayouts((prev) =>
      prev.map((p) =>
        selectedPayouts.includes(p.id)
          ? {
              ...p,
              status: 'Paid' as PayoutStatus,
              lastPayoutDate: today,
              lastPayoutAmount: p.availableBalance,
              availableBalance: 0,
            }
          : p
      )
    );
    setSelectedPayouts([]);
    setShowConfirmModal(false);
  };

  const selectedTotal = payouts
    .filter((p) => selectedPayouts.includes(p.id))
    .reduce((sum, p) => sum + p.availableBalance, 0);

  return (
    <div className="flex-1 min-h-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Merchant Payouts</h1>
          <p className="text-gray-600">
            Manage merchant settlements and escrow releases
          </p>
        </div>

      <EscrowSummary payouts={payouts} />

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by merchant name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | PayoutStatus)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {selectedPayouts.length > 0 && (
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="text-sm text-gray-600">
                {selectedPayouts.length} selected • ₦{selectedTotal.toLocaleString()}
              </div>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                Process Payouts
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedPayouts.length === filteredPayouts.length &&
                      filteredPayouts.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Available Balance
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pending Balance
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Last Payout
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPayouts.includes(payout.id)}
                      onChange={() => toggleSelection(payout.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {payout.merchantName}
                      </div>
                      <div className="text-xs text-gray-500">{payout.merchantId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-700">
                      ₦{payout.availableBalance.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-yellow-700">
                      ₦{payout.pendingBalance.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{payout.lastPayoutDate}</div>
                    <div className="text-xs text-gray-500">
                      ₦{payout.lastPayoutAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={payout.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payout.availableBalance > 0 ? (
                      <button
                        onClick={() => processSinglePayout(payout.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">No funds</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayouts.length === 0 && (
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No merchants found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Confirm Bulk Payout
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedPayouts.length} merchants selected
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₦{selectedTotal.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                This action will process payouts for all selected merchants
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={processBulkPayouts}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
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