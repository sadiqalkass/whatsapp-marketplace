'use client';

import { useState } from 'react';
import { Search, MoreVertical, Eye, CheckCircle, EyeOff, Image, Settings } from 'lucide-react';

type ProductStatus = 'Draft' | 'Approved' | 'Hidden';

interface Product {
  id: string;
  name: string;
  merchant: string;
  merchantId: string;
  category: string;
  status: ProductStatus;
  hasVariants: boolean;
  stockLevel: number;
  lastUpdated: string;
}

const mockProducts: Product[] = [
  {
    id: 'P001',
    name: 'Classic Cotton T-Shirt',
    merchant: 'Fashion Hub Store',
    merchantId: 'M001',
    category: 'Fashion & Apparel',
    status: 'Approved',
    hasVariants: true,
    stockLevel: 150,
    lastUpdated: '2024-12-19',
  },
  {
    id: 'P002',
    name: 'Wireless Bluetooth Headphones',
    merchant: 'TechGear Nigeria',
    merchantId: 'M002',
    category: 'Electronics',
    status: 'Approved',
    hasVariants: false,
    stockLevel: 45,
    lastUpdated: '2024-12-18',
  },
  {
    id: 'P003',
    name: 'Organic Honey 500g',
    merchant: 'Fresh Foods Market',
    merchantId: 'M003',
    category: 'Food & Beverages',
    status: 'Draft',
    hasVariants: false,
    stockLevel: 0,
    lastUpdated: '2024-12-20',
  },
  {
    id: 'P004',
    name: 'Leather Wallet - Premium',
    merchant: 'Fashion Hub Store',
    merchantId: 'M001',
    category: 'Fashion & Apparel',
    status: 'Approved',
    hasVariants: true,
    stockLevel: 80,
    lastUpdated: '2024-12-17',
  },
  {
    id: 'P005',
    name: 'Smart Watch Series 5',
    merchant: 'TechGear Nigeria',
    merchantId: 'M002',
    category: 'Electronics',
    status: 'Hidden',
    hasVariants: true,
    stockLevel: 12,
    lastUpdated: '2024-12-15',
  },
  {
    id: 'P006',
    name: 'Ceramic Coffee Mug Set',
    merchant: 'Home Essentials Plus',
    merchantId: 'M004',
    category: 'Home & Living',
    status: 'Approved',
    hasVariants: false,
    stockLevel: 200,
    lastUpdated: '2024-12-19',
  },
];

const StatusBadge = ({ status }: { status: ProductStatus }) => {
  const styles = {
    Draft: 'bg-gray-100 text-gray-800 border-gray-200',
    Approved: 'bg-green-100 text-green-800 border-green-200',
    Hidden: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
};

const StockLevelBadge = ({ level }: { level: number }) => {
  if (level === 0) {
    return (
      <span className="px-2 py-1 bg-red-100 text-red-800 border border-red-200 rounded text-xs font-medium">
        Out of Stock
      </span>
    );
  }
  if (level < 20) {
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded text-xs font-medium">
        Low Stock
      </span>
    );
  }
  return (
    <span className="text-sm font-semibold text-gray-900">{level} units</span>
  );
};

const ActionDropdown = ({
  product,
  onAction,
}: {
  product: Product;
  onAction: (action: string, id: string) => void;
}) => {
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
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button
              onClick={() => {
                onAction('view', product.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Product
            </button>
            {product.status === 'Draft' && (
              <button
                onClick={() => {
                  onAction('approve', product.id);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve Product
              </button>
            )}
            {product.status === 'Approved' && (
              <button
                onClick={() => {
                  onAction('hide', product.id);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <EyeOff className="w-4 h-4" />
                Hide Product
              </button>
            )}
            {product.status === 'Hidden' && (
              <button
                onClick={() => {
                  onAction('approve', product.id);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Unhide Product
              </button>
            )}
            <button
              onClick={() => {
                onAction('edit-media', product.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Image className="w-4 h-4" />
              Edit Media
            </button>
            <button
              onClick={() => {
                onAction('edit-variants', product.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Edit Variants
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [merchantFilter, setMerchantFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus>('all');

  const categories = Array.from(new Set(mockProducts.map((p) => p.category)));
  const merchants = Array.from(new Set(mockProducts.map((p) => p.merchant)));

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesMerchant = merchantFilter === 'all' || product.merchant === merchantFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesMerchant && matchesStatus;
  });

  const handleAction = (action: string, id: string) => {
    console.log(`Action: ${action} on product ${id}`);
    
    if (action === 'approve') {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'Approved' as ProductStatus } : p))
      );
    }
    
    if (action === 'hide') {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'Hidden' as ProductStatus } : p))
      );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Products</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage all products supplied by merchants before they go live on WhatsApp
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={merchantFilter}
            onChange={(e) => setMerchantFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Merchants</option>
            {merchants.map((merchant) => (
              <option key={merchant} value={merchant}>
                {merchant}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | ProductStatus)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Approved">Approved</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Has Variants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{product.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-gray-100">{product.merchant}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{product.merchantId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        product.hasVariants ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {product.hasVariants ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StockLevelBadge level={product.stockLevel} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {product.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ActionDropdown product={product} onAction={handleAction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}