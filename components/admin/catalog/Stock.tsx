'use client';

import { useState } from 'react';
import { Search, RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock, Wifi, WifiOff } from 'lucide-react';

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
type SyncStatus = 'Synced' | 'Not Synced';

interface StockItem {
  id: string;
  productName: string;
  merchant: string;
  merchantId: string;
  currentStock: number;
  stockStatus: StockStatus;
  syncStatus: SyncStatus;
  isEnabled: boolean;
  lastSynced: string;
}

const mockStockItems: StockItem[] = [
  {
    id: 'P001',
    productName: 'Classic Cotton T-Shirt',
    merchant: 'Fashion Hub Store',
    merchantId: 'M001',
    currentStock: 150,
    stockStatus: 'In Stock',
    syncStatus: 'Synced',
    isEnabled: true,
    lastSynced: '2 mins ago',
  },
  {
    id: 'P002',
    productName: 'Wireless Bluetooth Headphones',
    merchant: 'TechGear Nigeria',
    merchantId: 'M002',
    currentStock: 15,
    stockStatus: 'Low Stock',
    syncStatus: 'Synced',
    isEnabled: true,
    lastSynced: '5 mins ago',
  },
  {
    id: 'P003',
    productName: 'Organic Honey 500g',
    merchant: 'Fresh Foods Market',
    merchantId: 'M003',
    currentStock: 0,
    stockStatus: 'Out of Stock',
    syncStatus: 'Synced',
    isEnabled: false,
    lastSynced: '1 hour ago',
  },
  {
    id: 'P004',
    productName: 'Leather Wallet - Premium',
    merchant: 'Fashion Hub Store',
    merchantId: 'M001',
    currentStock: 80,
    stockStatus: 'In Stock',
    syncStatus: 'Not Synced',
    isEnabled: true,
    lastSynced: '30 mins ago',
  },
  {
    id: 'P005',
    productName: 'Smart Watch Series 5',
    merchant: 'TechGear Nigeria',
    merchantId: 'M002',
    currentStock: 12,
    stockStatus: 'Low Stock',
    syncStatus: 'Synced',
    isEnabled: true,
    lastSynced: '10 mins ago',
  },
  {
    id: 'P006',
    productName: 'Ceramic Coffee Mug Set',
    merchant: 'Home Essentials Plus',
    merchantId: 'M004',
    currentStock: 200,
    stockStatus: 'In Stock',
    syncStatus: 'Synced',
    isEnabled: true,
    lastSynced: '1 min ago',
  },
  {
    id: 'P007',
    productName: 'Gaming Mouse RGB',
    merchant: 'TechGear Nigeria',
    merchantId: 'M002',
    currentStock: 8,
    stockStatus: 'Low Stock',
    syncStatus: 'Not Synced',
    isEnabled: true,
    lastSynced: '45 mins ago',
  },
  {
    id: 'P008',
    productName: 'Yoga Mat Premium',
    merchant: 'Sports Arena Store',
    merchantId: 'M006',
    currentStock: 0,
    stockStatus: 'Out of Stock',
    syncStatus: 'Synced',
    isEnabled: false,
    lastSynced: '3 hours ago',
  },
];

const StockStatusBadge = ({ status }: { status: StockStatus }) => {
  const config = {
    'In Stock': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: CheckCircle,
    },
    'Low Stock': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: AlertTriangle,
    },
    'Out of Stock': {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: XCircle,
    },
  };

  const { bg, text, border, icon: Icon } = config[status];

  return (
    <span
      className={`${bg} ${text} ${border} px-3 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1.5`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

const SyncStatusIndicator = ({ status, lastSynced }: { status: SyncStatus; lastSynced: string }) => {
  if (status === 'Synced') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-green-700">
          <Wifi className="w-4 h-4" />
          <span className="text-xs font-medium">Synced</span>
        </div>
        <span className="text-xs text-gray-500">{lastSynced}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-red-700">
        <WifiOff className="w-4 h-4" />
        <span className="text-xs font-medium">Not Synced</span>
      </div>
      <span className="text-xs text-gray-500">{lastSynced}</span>
    </div>
  );
};

const ProductToggle = ({
  isEnabled,
  onChange,
  stockStatus,
}: {
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
  stockStatus: StockStatus;
}) => {
  const isDisabledByStock = stockStatus === 'Out of Stock';

  return (
    <button
      onClick={() => !isDisabledByStock && onChange(!isEnabled)}
      disabled={isDisabledByStock}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ${
        isEnabled ? 'bg-green-600' : 'bg-gray-300'
      } ${isDisabledByStock ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
      title={
        isDisabledByStock
          ? 'Product disabled due to zero stock'
          : isEnabled
          ? 'Click to disable'
          : 'Click to enable'
      }
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
          isEnabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

const StockSummaryCards = ({ items }: { items: StockItem[] }) => {
  const inStock = items.filter((i) => i.stockStatus === 'In Stock').length;
  const lowStock = items.filter((i) => i.stockStatus === 'Low Stock').length;
  const outOfStock = items.filter((i) => i.stockStatus === 'Out of Stock').length;
  const notSynced = items.filter((i) => i.syncStatus === 'Not Synced').length;

  const cards = [
    {
      label: 'In Stock',
      count: inStock,
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600',
    },
    {
      label: 'Low Stock',
      count: lowStock,
      icon: AlertTriangle,
      gradient: 'from-yellow-500 to-yellow-600',
    },
    {
      label: 'Out of Stock',
      count: outOfStock,
      icon: XCircle,
      gradient: 'from-red-500 to-red-600',
    },
    {
      label: 'Not Synced',
      count: notSynced,
      icon: WifiOff,
      gradient: 'from-gray-500 to-gray-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.gradient} rounded-xl p-5 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-95">{card.label}</span>
              <Icon className="w-5 h-5 opacity-90" />
            </div>
            <p className="text-3xl font-bold">{card.count}</p>
          </div>
        );
      })}
    </div>
  );
};

export default function StockSyncPage() {
  // State Management
  const [stockItems, setStockItems] = useState(mockStockItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | StockStatus>('all');
  const [syncFilter, setSyncFilter] = useState<'all' | SyncStatus>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStockStatus = stockFilter === 'all' || item.stockStatus === stockFilter;
    const matchesSyncStatus = syncFilter === 'all' || item.syncStatus === syncFilter;
    return matchesSearch && matchesStockStatus && matchesSyncStatus;
  });

  const handleToggleProduct = (id: string, enabled: boolean) => {
    setStockItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isEnabled: enabled } : item))
    );
  };

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setStockItems((prev) =>
        prev.map((item) => ({
          ...item,
          syncStatus: 'Synced' as SyncStatus,
          lastSynced: 'Just now',
        }))
      );
      setIsSyncing(false);
    }, 2000);
  };

  const handleSyncSingle = (id: string) => {
    setStockItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, syncStatus: 'Synced' as SyncStatus, lastSynced: 'Just now' }
          : item
      )
    );
  };

  const lowStockCount = stockItems.filter((i) => i.stockStatus === 'Low Stock').length;
  const outOfStockCount = stockItems.filter((i) => i.stockStatus === 'Out of Stock').length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Stock Sync</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and control product availability in real time
        </p>
      </div>

      {/* Alert Banner */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-semibold mb-1">Stock Alert</p>
            <p>
              {lowStockCount > 0 && `${lowStockCount} product(s) running low on stock. `}
              {outOfStockCount > 0 &&
                `${outOfStockCount} product(s) are out of stock and automatically disabled.`}
            </p>
          </div>
        </div>
      )}

      <StockSummaryCards items={stockItems} />

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as 'all' | StockStatus)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Stock Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            <select
              value={syncFilter}
              onChange={(e) => setSyncFilter(e.target.value as 'all' | SyncStatus)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Sync Status</option>
              <option value="Synced">Synced</option>
              <option value="Not Synced">Not Synced</option>
            </select>
          </div>

          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync All with WhatsApp'}
          </button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Stock Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Sync Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Enabled
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    item.stockStatus === 'Out of Stock' ? 'bg-gray-50 dark:bg-gray-700 opacity-75' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {item.productName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-gray-100">{item.merchant}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.merchantId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {item.currentStock}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StockStatusBadge status={item.stockStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SyncStatusIndicator status={item.syncStatus} lastSynced={item.lastSynced} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ProductToggle
                      isEnabled={item.isEnabled}
                      onChange={(enabled) => handleToggleProduct(item.id, enabled)}
                      stockStatus={item.stockStatus}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.syncStatus === 'Not Synced' && (
                      <button
                        onClick={() => handleSyncSingle(item.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Sync Now
                      </button>
                    )}
                    {item.syncStatus === 'Synced' && (
                      <span className="text-sm text-gray-400 dark:text-gray-500">Up to date</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <Clock className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No products found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}