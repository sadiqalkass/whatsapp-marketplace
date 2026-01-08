'use client';

import { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import { adminProductService } from '@/services/adminProduct.service';
import { getSocket } from '@/lib/socket';

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
type SyncStatus = 'Synced' | 'Not Synced';

interface StockItem {
  id: string;
  name: string;
  merchant: {
    id: string;
    businessName: string;
  };
  stockQuantity: number;
  stockStatus: StockStatus;
  whatsappSyncStatus: 'SYNCED' | 'NOT_SYNCED' | 'FAILED';
  isActive: boolean;
  lastSyncedAt: string | null;
}

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

const getStockStatus = (quantity: number): StockStatus => {
  if (quantity === 0) return 'Out of Stock';
  if (quantity <= 20) return 'Low Stock';
  return 'In Stock';
};

const StockSummaryCards = ({ items }: { items: StockItem[] }) => {
  const inStock = items.filter((i) => getStockStatus(i.stockQuantity) === 'In Stock').length;
  const lowStock = items.filter((i) => getStockStatus(i.stockQuantity) === 'Low Stock').length;
  const outOfStock = items.filter((i) => getStockStatus(i.stockQuantity) === 'Out of Stock').length;
  const notSynced = items.filter((i) => i.whatsappSyncStatus === 'NOT_SYNCED').length;

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
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | StockStatus>('all');
  const [syncFilter, setSyncFilter] = useState<'all' | SyncStatus>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await adminProductService.getProductsForSync();
      setStockItems(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    // Listen for real-time stock updates
    try {
      const socket = getSocket();
      
      socket.on('stock-updated', (data) => {
        console.log('Stock updated:', data.products);
        
        setStockItems((prev) =>
          prev.map((item) => {
            const updated = data.products.find((p: any) => p.id === item.id);
            return updated ? { ...item, stockQuantity: updated.stockQuantity } : item;
          })
        );
      });

      return () => {
        socket.off('stock-updated');
      };
    } catch (error) {
      console.error('Socket error:', error);
    }
  }, []);
  
  const filteredItems = stockItems.map((item: StockItem) => ({
    ...item,
    stockStatus: getStockStatus(item.stockQuantity)
  })).filter((item: StockItem) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStockStatus = stockFilter === 'all' || item.stockStatus === stockFilter;
    const matchesSyncStatus = syncFilter === 'all' || 
      (syncFilter === 'Synced' ? item.whatsappSyncStatus === 'SYNCED' : item.whatsappSyncStatus === 'NOT_SYNCED');
    return matchesSearch && matchesStockStatus && matchesSyncStatus;
  });

  const handleToggleProduct = async (id: string, enabled: boolean) => {
    try {
      await adminProductService.toggleProductStatus(id, enabled);
      await fetchProducts();
    } catch (error) {
      console.error('Toggle failed:', error);
    }
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await adminProductService.syncAllProducts();
      await fetchProducts();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncSingle = async (id: string) => {
    try {
      await adminProductService.syncSingleProduct(id);
      await fetchProducts();
    } catch (error) {
      console.error('Sync single product failed', error);
    }
  };

  const lowStockCount = stockItems.filter((i: StockItem) => getStockStatus(i.stockQuantity) === 'Low Stock').length;
  const outOfStockCount = stockItems.filter((i: StockItem) => getStockStatus(i.stockQuantity) === 'Out of Stock').length;

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

            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={7} className='text-center py-16'>
                    <RefreshCw className='w-8 h-8 text-gray-400 animate-spin mx-auto mb-3' />
                    <p className='text-gray-500'>Loading products...</p>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredItems.map((item: StockItem) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      getStockStatus(item.stockQuantity) === 'Out of Stock' ? 'bg-gray-50 dark:bg-gray-700 opacity-75' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900 dark:text-gray-100">{item.merchant.businessName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.merchant.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {item.stockQuantity}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StockStatusBadge status={item.stockStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <SyncStatusIndicator 
                        status={item.whatsappSyncStatus === 'SYNCED' ? 'Synced' : 'Not Synced'} 
                        lastSynced={item.lastSyncedAt || 'Never'} 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ProductToggle
                        isEnabled={item.isActive}
                        onChange={(enabled) => handleToggleProduct(item.id, enabled)}
                        stockStatus={getStockStatus(item.stockQuantity)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.whatsappSyncStatus === 'NOT_SYNCED' && (
                        <button
                          onClick={() => handleSyncSingle(item.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Sync Now
                        </button>
                      )}
                      {item.whatsappSyncStatus === 'SYNCED' && (
                        <span className="text-sm text-gray-400 dark:text-gray-500">Up to date</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
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