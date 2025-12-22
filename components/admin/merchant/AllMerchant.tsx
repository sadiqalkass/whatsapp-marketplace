'use client';

import { useState } from 'react';
import { Search, MoreVertical, Eye, Ban, CheckCircle, EyeOff } from 'lucide-react';

type MerchantStatus = 'Active' | 'Suspended';

interface Merchant {
  id: string;
  name: string;
  category: string;
  status: MerchantStatus;
  performanceScore: number;
  walletBalance: number;
  lastActivity: string;
}

const mockMerchants: Merchant[] = [
  {
    id: 'M001',
    name: 'Fashion Hub Store',
    category: 'Fashion & Apparel',
    status: 'Active',
    performanceScore: 4.8,
    walletBalance: 45000,
    lastActivity: '2 hours ago',
  },
  {
    id: 'M002',
    name: 'TechGear Nigeria',
    category: 'Electronics',
    status: 'Active',
    performanceScore: 4.6,
    walletBalance: 120000,
    lastActivity: '5 hours ago',
  },
  {
    id: 'M003',
    name: 'Fresh Foods Market',
    category: 'Food & Beverages',
    status: 'Suspended',
    performanceScore: 3.2,
    walletBalance: 8500,
    lastActivity: '3 days ago',
  },
  {
    id: 'M004',
    name: 'Home Essentials Plus',
    category: 'Home & Living',
    status: 'Active',
    performanceScore: 4.9,
    walletBalance: 67000,
    lastActivity: '1 hour ago',
  },
  {
    id: 'M005',
    name: 'Beauty & Care Shop',
    category: 'Beauty & Personal Care',
    status: 'Active',
    performanceScore: 4.7,
    walletBalance: 34500,
    lastActivity: '30 minutes ago',
  },
];

const StatusBadge = ({ status }: { status: MerchantStatus }) => {
  const styles = {
    Active: 'bg-green-100 text-green-800 border-green-200',
    Suspended: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
};

const ActionDropdown = ({ merchant, onAction }: { merchant: Merchant; onAction: (action: string, id: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button
              onClick={() => {
                onAction('view', merchant.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button
              onClick={() => {
                onAction(merchant.status === 'Active' ? 'suspend' : 'activate', merchant.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              {merchant.status === 'Active' ? (
                <>
                  <Ban className="w-4 h-4" />
                  Suspend Merchant
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Activate Merchant
                </>
              )}
            </button>
            <button
              onClick={() => {
                onAction('hide-products', merchant.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <EyeOff className="w-4 h-4" />
              Hide Products
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default function AllMerchantsPage() {
  const [merchants, setMerchants] = useState(mockMerchants);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MerchantStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = Array.from(new Set(mockMerchants.map(m => m.category)));

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || merchant.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || merchant.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAction = (action: string, id: string) => {
    console.log(`Action: ${action} on merchant ${id}`);
    if (action === 'suspend' || action === 'activate') {
      setMerchants(prev =>
        prev.map(m =>
          m.id === id
            ? { ...m, status: action === 'suspend' ? 'Suspended' : 'Active' }
            : m
        )
      );
    }
  };

  return (
    <div className="flex-1 min-h-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">All Merchants</h1>
          <p className="text-gray-600">Monitor and manage all verified and suspended merchants</p>
        </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search merchants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | MerchantStatus)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Merchants Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMerchants.map((merchant) => (
                <tr key={merchant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{merchant.name}</div>
                      <div className="text-sm text-gray-500">{merchant.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {merchant.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={merchant.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {merchant.performanceScore}
                      </span>
                      <span className="text-sm text-gray-500">/ 5.0</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₦{merchant.walletBalance.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {merchant.lastActivity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ActionDropdown merchant={merchant} onAction={handleAction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMerchants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No merchants found</p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}