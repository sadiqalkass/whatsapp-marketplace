'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, DollarSign, Package, X, Upload, Trash2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

type Product = {
  name: string;
  category: string;
  price: number;
  description: string;
  stockQuantity: number;
  unit: string;
  minOrderQty: number;
  variants: { type: string; value: string }[];
};


// Mock data
const mockProducts = [
  { id: 1, name: 'Fresh Tomatoes', category: 'Vegetables', price: 1500, stock: 'In Stock', approval: 'Approved', lastUpdated: '2 hours ago' },
  { id: 2, name: 'Palm Oil (5L)', category: 'Oils & Condiments', price: 8500, stock: 'Low Stock', approval: 'Approved', lastUpdated: '1 day ago' },
  { id: 3, name: 'Fresh Chicken', category: 'Proteins', price: 3200, stock: 'Out of Stock', approval: 'Pending', lastUpdated: '3 hours ago' },
  { id: 4, name: 'Jollof Rice Mix', category: 'Grains & Cereals', price: 2500, stock: 'In Stock', approval: 'Approved', lastUpdated: '5 days ago' },
  { id: 5, name: 'Scotch Bonnet Pepper', category: 'Vegetables', price: 800, stock: 'In Stock', approval: 'Rejected', lastUpdated: '2 days ago' },
];

const categories = ['Vegetables', 'Proteins', 'Grains & Cereals', 'Oils & Condiments', 'Spices', 'Beverages', 'Snacks'];

const MerchantProducts = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState(mockProducts);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(true); // TODO: Get from backend/context
  const [businessName, setBusinessName] = useState('TechHub Electronics'); // TODO: Get from profile/context
  const [productImages, setProductImages] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    stockQuantity: '',
    unit: '',
    minOrderQty: '',
    variants: [{ type: '', value: '' }]
  });

  // Check verification status when component loads
  useEffect(() => {
    // TODO: Replace with actual API call
    const checkVerification = async () => {
      // const response = await fetch('/api/merchant/verification-status');
      // const data = await response.json();
      // setIsVerified(data.isVerified);
      // setBusinessName(data.businessName);
    };
    
    checkVerification();
  }, []);

  const getStockBadge = (stock: string) => {
    const styles = {
      'In Stock': 'bg-green-100 text-green-700',
      'Low Stock': 'bg-yellow-100 text-yellow-700',
      'Out of Stock': 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${styles[stock as keyof typeof styles]}`}>
        {stock}
      </span>
    );
  };

  const getApprovalBadge = (approval: string) => {
    const styles = {
      'Approved': 'bg-green-100 text-green-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Rejected': 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${styles[approval as keyof typeof styles]}`}>
        {approval}
      </span>
    );
  };

  const handleAddProduct = () => {
    // Check if merchant is verified
    if (!isVerified) {
      // Redirect to profile page for verification
      alert('Please complete your verification first');
      window.location.href = '/merchant/profile';
      // Or use Next.js router: router.push('/merchant/profile');
      return;
    }

    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      stockQuantity: '',
      unit: '',
      minOrderQty: '',
      variants: [{ type: '', value: '' }],
    });
    setProductImages([]);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      stockQuantity: product.stockQuantity.toString(),
      unit: product.unit,
      minOrderQty: product.minOrderQty.toString(),
      price: product.price.toString(),
      variants: [{ type: '', value: '' }]
    });
    setProductImages([]);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setProductImages([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length + productImages.length > 5) {
        alert('Maximum 5 images allowed');
        return;
      }
      setProductImages([...productImages, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.category || !formData.price || !formData.description || 
      !formData.stockQuantity || !formData.unit || !formData.minOrderQty) {
      alert('Please fill all required fields');
      return;
    }

    if (productImages.length === 0) {
      alert('Please upload at least one product image');
      return;
    }

    const submitData = new FormData();
    
    // Add product details
    submitData.append('name', formData.name);
    submitData.append('category', formData.category);
    submitData.append('price', formData.price);
    submitData.append('businessName', businessName);
    submitData.append('description', formData.description);
    submitData.append('stockQuantity', formData.stockQuantity);
    submitData.append('unit', formData.unit);
    submitData.append('minOrderQty', formData.minOrderQty);
    
    // Add images
    productImages.forEach((image, index) => {
      submitData.append(`images`, image);
    });
    
    // Add variants
    submitData.append('variants', JSON.stringify(formData.variants.filter(v => v.type && v.value)));
    
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/merchant/products', {
        method: 'POST',
        body: submitData
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Product submitted:', data);
        alert('Product submitted for review successfully!');
        handleCloseForm();
        // Optionally refresh products list
      } else {
        alert('Failed to submit product');
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Error submitting product. Please try again.');
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { type: '', value: '' }]
    });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    });
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Verification Warning Banner */}
        {!isVerified && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                Verification Required
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                You need to complete your account verification before you can add products.
              </p>
              <button
                onClick={() => window.location.href = '/merchant/profile'}
                className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
              >
                Complete Verification Now →
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
            {isVerified && (
              <p className="text-sm text-gray-600 mt-1">Business: {businessName}</p>
            )}
          </div>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-700 font-medium transition-colors text-sm sm:text-base w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isVerified}
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Approval</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Updated</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{product.name}</td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{product.category}</td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">₦{product.price.toLocaleString()}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{getStockBadge(product.stock)}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">{getApprovalBadge(product.approval)}</td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap hidden lg:table-cell">{product.lastUpdated}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Update price"
                        >
                          <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          className="p-1.5 sm:p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Update stock"
                        >
                          <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              {/* Form Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Business: {businessName}</p>
                </div>
                <button
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-blue-800">
                    Fill in the product details below. All products are reviewed by our admin team before being listed on the marketplace.
                  </p>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="e.g., Fresh Tomatoes"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Wholesale Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wholesale Price (₦) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="e.g., 1500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the price per unit</p>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Describe your product, quality, origin, etc."
                    rows={4}
                  />
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="e.g., 100"
                    min="0"
                  />
                </div>

                {/* Unit of Measurement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit of Measurement <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select unit</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="pieces">Pieces</option>
                    <option value="liters">Liters</option>
                    <option value="packs">Packs</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>

                {/* Minimum Order Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderQty}
                    onChange={(e) => setFormData({ ...formData, minOrderQty: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="e.g., 10"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum quantity buyers must order</p>
                </div>


                {/* Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-orange-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="product-images"
                    />
                    <label htmlFor="product-images" className="cursor-pointer">
                      <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB (Max 5 images)</p>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {productImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {productImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Variants */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Variants
                    </label>
                    <button
                      onClick={addVariant}
                      className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      + Add Variant
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Add different sizes, weights, or colors if applicable</p>
                  
                  <div className="space-y-3">
                    {formData.variants.map((variant, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-start">
                        <select
                          value={variant.type}
                          onChange={(e) => updateVariant(index, 'type', e.target.value)}
                          className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                        >
                          <option value="">Select type</option>
                          <option value="size">Size</option>
                          <option value="weight">Weight</option>
                          <option value="color">Color</option>
                        </select>
                        <input
                          type="text"
                          value={variant.value}
                          onChange={(e) => updateVariant(index, 'value', e.target.value)}
                          placeholder="e.g., 1kg, Large, Red"
                          className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                        />
                        {formData.variants.length > 1 && (
                          <button
                            onClick={() => removeVariant(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors self-stretch sm:self-auto"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCloseForm}
                    className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 sm:px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors text-sm sm:text-base"
                  >
                    {editingProduct ? 'Update Product' : 'Submit for Review'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantProducts;