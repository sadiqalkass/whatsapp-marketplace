'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Package, Loader2, RefreshCw, Plus, Minus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { merchantStockService } from '@/services/merchantStock.service';

// Types based on your API response
interface ApiProduct {
  id: string;
  productId: string;
  name: string;
  price?: number;
  currentStock: number;
  minimumStock?: number;
  category?: string;
  sku?: string;
  description?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Local product type
interface Product {
  id: string;
  name: string;
  stock: number;
  lastUpdated: string;
  apiData: ApiProduct; // Store original API data
}

// Format API data to local format
const formatProduct = (apiProduct: ApiProduct): Product => {
  const formatTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return {
    id: apiProduct.productId || apiProduct.id,
    name: apiProduct.name,
    stock: apiProduct.currentStock,
    lastUpdated: formatTimeSince(apiProduct.updatedAt || apiProduct.createdAt),
    apiData: apiProduct,
  };
};

export default function MerchantStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modifiedProducts, setModifiedProducts] = useState<Set<string>>(new Set());
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editStockValue, setEditStockValue] = useState<string>('');

  // Fetch products on component mount
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await merchantStockService.getMerchantProducts()
      if (response.data.length === 0) {
        toast.error('No products found');
        return;
      }
      setApiProducts(response.data);
      setProducts(response.data.map(formatProduct));
      
      // Show toast if data loaded successfully
      if (response.data.length > 0) {
        toast.success(`${response.data.length} products loaded`);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { 
      label: 'Out of Stock', 
      color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400' 
    };
    if (stock <= 10) return { 
      label: 'Low Stock', 
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400' 
    };
    return { 
      label: 'In Stock', 
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' 
    };
  };

  const handleStockUpdate = (id: string, newStock: string) => {
    const stockValue = parseInt(newStock) || 0;
    setProducts(prev => prev.map(p => 
      p.id === id 
        ? { ...p, stock: stockValue, lastUpdated: 'Just now' }
        : p
    ));
    setModifiedProducts(prev => new Set(prev).add(id));
  };

  const startEditStock = (product: Product) => {
    setEditingProductId(product.id);
    setEditStockValue(product.stock.toString());
  };

  const cancelEditStock = () => {
    setEditingProductId(null);
    setEditStockValue('');
  };

  const saveStock = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    try {
      // Update via API
      await merchantStockService.updateStock(
        product.apiData.id, 
        parseInt(editStockValue) || 0
      );
      
      // Update local state
      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { 
              ...p, 
              stock: parseInt(editStockValue) || 0, 
              lastUpdated: 'Just now',
              apiData: { ...p.apiData, currentStock: parseInt(editStockValue) || 0 }
            }
          : p
      ));
      
      setModifiedProducts(prev => new Set(prev).add(productId));
      setEditingProductId(null);
      setEditStockValue('');
      
      toast.success(`${product.name} stock updated to ${editStockValue}`);
    } catch (error) {
      console.error('Failed to update stock:', error);
      toast.error('Failed to update stock. Please try again.');
    }
  };

  const addStock = (productId: string, amount: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newStock = product.stock + amount;
    if (newStock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, stock: newStock, lastUpdated: 'Just now' }
        : p
    ));
    setModifiedProducts(prev => new Set(prev).add(productId));
    
    toast.success(`${amount >= 0 ? '+' : ''}${amount} units added to ${product.name}`);
  };

  const handleSaveAllChanges = async () => {
    if (modifiedProducts.size === 0) {
      toast.error('No changes to save');
      return;
    }

    setIsSaving(true);
    
    try {
      const updates = products
        .filter(p => modifiedProducts.has(p.id))
        .map(p => ({ productId: p.apiData.id, currentStock: p.stock }));

      await merchantStockService.bulkUpdateStock({ updates });
      
      // Reset modified products
      setModifiedProducts(new Set());
      
      // Refresh data
      setRefreshing(true);
      await fetchProducts();
      
      toast.success(`${updates.length} product(s) updated successfully!`);
    } catch (error) {
      console.error('Failed to save changes:', error);
      toast.error('Failed to update stock levels');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
  };

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Loading stock data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
          },
          success: {
            style: {
              background: '#065f46',
            },
          },
          error: {
            style: {
              background: '#7f1d1d',
            },
          },
        }}
      />
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Stock Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update and monitor your product inventory levels
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stock Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Low Stock</p>
          <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
        </div>
      </div>

      {/* Low Stock Warning */}
      {lowStockCount > 0 && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
              Low Stock Alert
            </h3>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {lowStockCount} product(s) are running low on stock
            </p>
          </div>
        </div>
      )}

      {/* Save Changes Button */}
      {modifiedProducts.size > 0 && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleSaveAllChanges}
            disabled={isSaving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              `Save All Changes (${modifiedProducts.size})`
            )}
          </button>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {products.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No products found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Add products to start managing your stock
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Quick Actions
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => {
                const status = getStockStatus(product.stock);
                const isEditing = editingProductId === product.id;
                
                return (
                  <tr key={product.id} className={product.stock === 0 ? 'opacity-60' : ''}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Package size={20} className="text-gray-400" />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </span>
                          {product.apiData.sku && (
                            <p className="text-xs text-gray-500">SKU: {product.apiData.sku}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={editStockValue}
                            onChange={(e) => setEditStockValue(e.target.value)}
                            className="w-24 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            autoFocus
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => setEditStockValue((parseInt(editStockValue) || 0 + 1).toString())}
                              className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              +
                            </button>
                            <button
                              onClick={() => {
                                const newVal = (parseInt(editStockValue) || 0) - 1;
                                setEditStockValue(Math.max(0, newVal).toString());
                              }}
                              className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              -
                            </button>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="number"
                          min="0"
                          value={product.stock}
                          onChange={(e) => handleStockUpdate(product.id, e.target.value)}
                          className="w-24 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {product.lastUpdated}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => addStock(product.id, 1)}
                          className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded hover:bg-emerald-200 dark:hover:bg-emerald-800/50"
                          title="Add 1 unit"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => addStock(product.id, 5)}
                          className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs font-medium hover:bg-emerald-200 dark:hover:bg-emerald-800/50"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => addStock(product.id, -1)}
                          disabled={product.stock <= 0}
                          className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remove 1 unit"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveStock(product.id)}
                              className="px-3 py-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditStock}
                              className="px-3 py-1 text-xs font-medium bg-gray-600 hover:bg-gray-700 text-white rounded"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEditStock(product)}
                            className="px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {products.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No products found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Add products to start managing your stock
            </p>
          </div>
        ) : (
          products.map((product) => {
            const status = getStockStatus(product.stock);
            const isEditing = editingProductId === product.id;
            
            return (
              <div
                key={product.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${
                  product.stock === 0 ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <Package size={18} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                      {product.apiData.sku && (
                        <p className="text-xs text-gray-500">SKU: {product.apiData.sku}</p>
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Stock Level</span>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={editStockValue}
                            onChange={(e) => setEditStockValue(e.target.value)}
                            className="w-24 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={() => saveStock(product.id)}
                              className="px-3 py-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditStock}
                              className="px-3 py-1 text-xs font-medium bg-gray-600 hover:bg-gray-700 text-white rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <input
                            type="number"
                            min="0"
                            value={product.stock}
                            onChange={(e) => handleStockUpdate(product.id, e.target.value)}
                            className="w-24 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                          <button
                            onClick={() => startEditStock(product)}
                            className="px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Quick Adjust</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addStock(product.id, 1)}
                        className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs font-medium hover:bg-emerald-200 dark:hover:bg-emerald-800/50"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => addStock(product.id, 5)}
                        className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs font-medium hover:bg-emerald-200 dark:hover:bg-emerald-800/50"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => addStock(product.id, -1)}
                        disabled={product.stock <= 0}
                        className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-medium hover:bg-red-200 dark:hover:bg-red-800/50 disabled:opacity-50"
                      >
                        -1
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Last updated</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{product.lastUpdated}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}