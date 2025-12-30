'use client';

import { useState, useEffect } from 'react';
import { Search, MoreVertical, Eye, Ban, CheckCircle, EyeOff } from 'lucide-react';
import { adminMerchantService } from '@/services/adminMerchant.service';

type MerchantStatus = 'Active' | 'Suspended';

type BackendMerchant = {
  id: string;
  businessName: string;
  category: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  user: {
    email: string;
    createdAt: string;
  };
};

interface DisplayMerchant {
  id: string;
  name: string;
  category: string;
  status: MerchantStatus;
  performanceScore: number;
  walletBalance: number;
  lastActivity: string;
}

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

const ActionDropdown = ({ merchant, onAction }: { merchant: DisplayMerchant; onAction: (action: string, id: string) => void }) => {
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
  const [merchants, setMerchants] = useState<DisplayMerchant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MerchantStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchMerchants();
  }, [statusFilter]);

  const transformMerchant = (m: BackendMerchant): DisplayMerchant => {
    return {
      id: m.id,
      name: m.businessName,
      category: m.category,
      status: m.verificationStatus === 'VERIFIED' ? 'Active' : 'Suspended',
      performanceScore: 4.5,
      walletBalance: 0, 
      lastActivity: new Date(m.user.createdAt).toLocaleDateString()
    };
  };

  const fetchMerchants = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setSkip(0);
      }

      const currentSkip = isLoadMore ? skip : 0;
      const statusValue = statusFilter === 'all' ? 'VERIFIED' : statusFilter;

      const response = await adminMerchantService.getAllMerchants( 
        statusValue as any,
        limit,
        currentSkip
      );

      if (isLoadMore) {
        setMerchants(prev => [...prev, ...response.data.map(transformMerchant)]);
        setSkip(currentSkip + limit);
      } else {
        setMerchants(response.data.map(transformMerchant));
        setSkip(limit);
      }

      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch merchants:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const categories = Array.from(new Set(merchants.map(m => m.category)));

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

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading merchants...</div>
          </div>
        )}

      {!loading &&(
        <>
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

            {/* Load More Button */}
            {!loading && merchants.length < total && (
              <div className="text-center py-6 border-t border-gray-200">
                <button
                  onClick={() => fetchMerchants(true)}
                  disabled={loadingMore}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? 'Loading...' : `Load More (${total - merchants.length} remaining)`}
                </button>
              </div>
            )}
          </div>  
        </>
      )}
    </div>
  </div>
);
}