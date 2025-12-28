'use client';

import React, { useState } from 'react';
import { AlertCircle, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  stock: number;
  lastUpdated: string;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Wireless Earbuds Pro', stock: 45, lastUpdated: '2 hours ago' },
  { id: '2', name: 'Smart Watch Series 5', stock: 8, lastUpdated: '5 hours ago' },
  { id: '3', name: 'USB-C Cable 2m', stock: 0, lastUpdated: '1 day ago' },
  { id: '4', name: 'Phone Case - Blue', stock: 120, lastUpdated: '3 hours ago' },
  { id: '5', name: 'Screen Protector Pack', stock: 5, lastUpdated: '6 hours ago' },
  { id: '6', name: 'Laptop Stand Aluminum', stock: 34, lastUpdated: '4 hours ago' },
  { id: '7', name: 'Wireless Mouse', stock: 2, lastUpdated: '8 hours ago' },
  { id: '8', name: 'Keyboard Mechanical RGB', stock: 0, lastUpdated: '2 days ago' },
];

export default function MerchantStockPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
<<<<<<< HEAD
  const [isEdit, setIsEdit] = useState(true);
=======
  const [modifiedProducts, setModifiedProducts] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
>>>>>>> 4a690de4b49266dd3967f469556430b7348c90fe

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400' };
    if (stock <= 10) return { label: 'Low Stock', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400' };
    return { label: 'In Stock', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' };
  };

  const handleStockUpdate = (id: string, newStock: string) => {
    const stockValue = parseInt(newStock) || 0;
    setProducts(products.map(p => 
      p.id === id 
        ? { ...p, stock: stockValue, lastUpdated: 'Just now' }
        : p
    ));
    setModifiedProducts(prev => new Set(prev).add(id));
  };
  const addStock = (id: string, newStock: string) => {
    setIsEdit(false);
    const stockValue = parseInt(newStock) || 0;
    setProducts(products.map(p => 
      p.id === id 
        ? { ...p, stock: stockValue, lastUpdated: 'Just now' }
        : p
    ));
  };

  const saveStock = (id: string) => {
    setIsEdit(true);
    setProducts(products.map(p => 
      p.id === id 
        ? { ...p, lastUpdated: 'Just now' }
        : p
    ));
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    try {
      const updates = products
        .filter(p => modifiedProducts.has(p.id))
        .map(p => ({ id: p.id, stock: p.stock }));

      // api call to save updates would go here
      console.log('Saving updates:', updates);

      alert('Stock levels updated successfully!');
      setModifiedProducts(new Set());
    } catch (error) {
      alert('Failed to update stock');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Stock Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update and monitor your product inventory levels
        </p>
      </div>

      {/* Low Stock Warning */}
      {products.some(p => p.stock > 0 && p.stock <= 10) && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
              Low Stock Alert
            </h3>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {products.filter(p => p.stock > 0 && p.stock <= 10).length} product(s) are running low on stock
            </p>
          </div>
        </div>
      )}

      {modifiedProducts.size > 0 && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
          >
            {isSaving ? 'Saving...' : `Save Changes (${modifiedProducts.size})`}
          </button>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
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
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => {
              const status = getStockStatus(product.stock);
              return (
                <tr key={product.id} className={product.stock === 0 ? 'opacity-60' : ''}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Package size={20} className="text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="0"
                      disabled={isEdit}
                      value={product.stock}
                      onChange={(e) => handleStockUpdate(product.id, e.target.value)}
                      className="w-24 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {product.lastUpdated}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <span onClick={() => addStock(product.id, product.stock.toString())} className="inline-flex px-3 justify-between cursor-pointer items-center py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      Edit
                    </span>
                    <span onClick={() => saveStock(product.id)} className="inline-flex px-3 justify-between cursor-pointer items-center py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400">
                      Save
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {products.map((product) => {
          const status = getStockStatus(product.stock);
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
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </h3>
                </div>
                <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Stock Level</span>
                  <input
                    type="number"
                    min="0"
                    value={product.stock}
                    onChange={(e) => handleStockUpdate(product.id, e.target.value)}
                    className="w-24 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Last updated</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{product.lastUpdated}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}