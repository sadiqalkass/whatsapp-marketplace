'use client';

import { useState } from 'react';
import { Search, Save, TrendingUp, AlertCircle } from 'lucide-react';

// Types
type PriceStatus = 'Active' | 'Inactive';

interface ProductPrice {
  id: string;
  productName: string;
  merchant: string;
  merchantId: string;
  wholesalePrice: number;
  markup: number;
  retailPrice: number;
  margin: number;
  status: PriceStatus;
}

// Helper Functions
const calculateRetailPrice = (wholesale: number, markup: number): number => {
  return wholesale + (wholesale * markup) / 100;
};

const calculateMargin = (wholesale: number, retail: number): number => {
  return ((retail - wholesale) / retail) * 100;
};

// Mock Data
const mockPrices: ProductPrice[] = [
  {
    id: 'P001',
    productName: 'Classic Cotton T-Shirt',
    merchant: 'Fashion Hub Store',
    merchantId: 'M001',
    wholesalePrice: 2500,
    markup: 40,
    retailPrice: 3500,
    margin: 28.57,
    status: 'Active',
  },
  {
    id: 'P002',
    productName: 'Wireless Bluetooth Headphones',
    merchant: 'TechGear Nigeria',
    merchantId: 'M002',
    wholesalePrice: 15000,
    markup: 35,
    retailPrice: 20250,
    margin: 25.93,
    status: 'Active',
  },
  {
    id: 'P003',
    productName: 'Organic Honey 500g',
    merchant: 'Fresh Foods Market',
    merchantId: 'M003',
    wholesalePrice: 1800,
    markup: 50,
    retailPrice: 2700,
    margin: 33.33,
    status: 'Inactive',
  },
  {
    id: 'P004',
    productName: 'Leather Wallet - Premium',
    merchant: 'Fashion Hub Store',
    merchantId: 'M001',
    wholesalePrice: 8000,
    markup: 45,
    retailPrice: 11600,
    margin: 31.03,
    status: 'Active',
  },
  {
    id: 'P005',
    productName: 'Smart Watch Series 5',
    merchant: 'TechGear Nigeria',
    merchantId: 'M002',
    wholesalePrice: 45000,
    markup: 30,
    retailPrice: 58500,
    margin: 23.08,
    status: 'Active',
  },
];

// Component: Status Toggle
const StatusToggle = ({
  status,
  onChange,
}: {
  status: PriceStatus;
  onChange: (status: PriceStatus) => void;
}) => {
  return (
    <button
      onClick={() => onChange(status === 'Active' ? 'Inactive' : 'Active')}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        status === 'Active' ? 'bg-green-600' : 'bg-gray-300'
      }`}
      aria-label={`Toggle status: ${status}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          status === 'Active' ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

// Component: Price Input
const PriceInput = ({
  value,
  onChange,
  onSave,
}: {
  value: number;
  onChange: (value: number) => void;
  onSave: () => void;
}) => {
  const [localValue, setLocalValue] = useState(value.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = () => {
    const numValue = parseFloat(localValue);
    if (!isNaN(numValue) && numValue >= 0) {
      onChange(numValue);
      onSave();
    } else {
      setLocalValue(value.toString());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleBlur();
          }
        }}
        className={`w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
          isEditing ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
        }`}
        aria-label="Markup percentage"
      />
      <span className="text-sm text-gray-500 dark:text-gray-400">%</span>
    </div>
  );
};

// Main Component
export default function PricingManagerPage() {
  // State Management
  const [prices, setPrices] = useState(mockPrices);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [bulkMarkup, setBulkMarkup] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Computed Values
  const filteredPrices = prices.filter((price) =>
    price.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Event Handlers
  const handleMarkupChange = (id: string, newMarkup: number) => {
    setPrices((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newRetail = calculateRetailPrice(p.wholesalePrice, newMarkup);
          const newMargin = calculateMargin(p.wholesalePrice, newRetail);
          return {
            ...p,
            markup: newMarkup,
            retailPrice: Math.round(newRetail),
            margin: parseFloat(newMargin.toFixed(2)),
          };
        }
        return p;
      })
    );
  };

  const handleStatusChange = (id: string, newStatus: PriceStatus) => {
    setPrices((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
  };

  const toggleSelection = (id: string) => {
    setSelectedPrices((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPrices.length === filteredPrices.length) {
      setSelectedPrices([]);
    } else {
      setSelectedPrices(filteredPrices.map((p) => p.id));
    }
  };

  const handleBulkUpdate = () => {
    const markup = parseFloat(bulkMarkup);
    if (!isNaN(markup) && markup >= 0) {
      setPrices((prev) =>
        prev.map((p) => {
          if (selectedPrices.includes(p.id)) {
            const newRetail = calculateRetailPrice(p.wholesalePrice, markup);
            const newMargin = calculateMargin(p.wholesalePrice, newRetail);
            return {
              ...p,
              markup,
              retailPrice: Math.round(newRetail),
              margin: parseFloat(newMargin.toFixed(2)),
            };
          }
          return p;
        })
      );
      setSelectedPrices([]);
      setShowBulkModal(false);
      setBulkMarkup('');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Pricing Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Control retail pricing while keeping merchant wholesale prices visible internally
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium mb-1">Pricing Control</p>
          <p>
            Wholesale prices are set by merchants and cannot be edited. Adjust markup percentages
            to automatically calculate retail prices and margins.
          </p>
        </div>
      </div>

      {/* Search and Bulk Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {selectedPrices.length > 0 && (
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Update {selectedPrices.length} Selected
            </button>
          )}
        </div>
      </div>

      {/* Pricing Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedPrices.length === filteredPrices.length &&
                      filteredPrices.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                    aria-label="Select all products"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Wholesale Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Markup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Retail Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPrices.map((price) => (
                <tr key={price.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes(price.id)}
                      onChange={() => toggleSelection(price.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                      aria-label={`Select ${price.productName}`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {price.productName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{price.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-gray-100">{price.merchant}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{price.merchantId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded border border-gray-200 dark:border-gray-600 inline-block">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        ₦{price.wholesalePrice.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriceInput
                      value={price.markup}
                      onChange={(newMarkup) => handleMarkupChange(price.id, newMarkup)}
                      onSave={() => console.log('Saved markup for', price.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded border border-green-200 dark:border-green-800 inline-block">
                      <span className="text-sm font-bold text-green-700 dark:text-green-400">
                        ₦{price.retailPrice.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {price.margin.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusToggle
                      status={price.status}
                      onChange={(newStatus) => handleStatusChange(price.id, newStatus)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPrices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No products found</p>
          </div>
        )}
      </div>

      {/* Bulk Update Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Bulk Markup Update
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Set a new markup percentage for {selectedPrices.length} selected products. Retail
              prices will be automatically recalculated.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Markup Percentage
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={bulkMarkup}
                  onChange={(e) => setBulkMarkup(e.target.value)}
                  placeholder="e.g. 40"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <span className="text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkMarkup('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpdate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}