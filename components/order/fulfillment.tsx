'use client';

import React, { useState } from 'react';
import { Truck, Search, Filter, Bell, UserPlus, FileText, ChevronDown, Package, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

// Mock Data for Fulfillment
const mockFulfillments = [
  { 
    id: 'ORD-001', 
    merchant: 'Tech Store', 
    items: 'iPhone 13, AirPods Pro, Leather Case', 
    pickupStatus: 'Picked Up', 
    deliveryPartner: 'QuickShip', 
    rider: 'Ahmed Kamaldeen', 
    deliveryStatus: 'In Transit' 
  },
  { 
    id: 'ORD-003', 
    merchant: 'Fashion Hub', 
    items: 'Nike Sneakers, Adidas T-Shirt, Cap, Socks, Backpack', 
    pickupStatus: 'Pending', 
    deliveryPartner: 'FastDelivery', 
    rider: 'Unassigned', 
    deliveryStatus: 'Awaiting Pickup' 
  },
  { 
    id: 'ORD-005', 
    merchant: 'Home Essentials', 
    items: 'Blender, Toaster, Coffee Maker, Kettle', 
    pickupStatus: 'Ready for Pickup', 
    deliveryPartner: 'SpeedEx', 
    rider: 'Unassigned', 
    deliveryStatus: 'Awaiting Pickup' 
  },
  { 
    id: 'ORD-004', 
    merchant: 'Book World', 
    items: 'Harry Potter Collection, Notebook', 
    pickupStatus: 'Picked Up', 
    deliveryPartner: 'QuickShip', 
    rider: 'Fatima Bello', 
    deliveryStatus: 'Out for Delivery' 
  },
  { 
    id: 'ORD-008', 
    merchant: 'Electronics Plus', 
    items: 'Laptop, Mouse, Keyboard, USB Hub, Laptop Bag, Charger', 
    pickupStatus: 'Pending', 
    deliveryPartner: 'FastDelivery', 
    rider: 'Unassigned', 
    deliveryStatus: 'Awaiting Merchant' 
  },
  { 
    id: 'ORD-006', 
    merchant: 'Beauty Store', 
    items: 'Perfume Set, Makeup Kit', 
    pickupStatus: 'Picked Up', 
    deliveryPartner: 'SpeedEx', 
    rider: 'Chinedu Okafor', 
    deliveryStatus: 'In Transit' 
  },
];

type StatusBadgeProps = { status: string; type?: 'pickup' | 'delivery' };
const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'pickup' }) => {
  const getStyles = () => {
    if (type === 'pickup') {
      switch (status) {
        case 'Picked Up':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'Ready for Pickup':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
    
    // Delivery status
    switch (status) {
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Awaiting Pickup':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Awaiting Merchant':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStyles()}`}>
      {status}
    </span>
  );
};

type Fulfillment = { id: string; merchant: string; items: string; pickupStatus: string; deliveryPartner: string; rider: string; deliveryStatus: string };

type FulfillmentRowProps = { fulfillment: Fulfillment; onNotifyMerchant: (id: string) => void; onAssignRider: (id: string) => void; onGenerateWaybill: (id: string) => void };
const FulfillmentRow: React.FC<FulfillmentRowProps> = ({ fulfillment, onNotifyMerchant, onAssignRider, onGenerateWaybill }) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{fulfillment.id}</td>
      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap truncate max-w-[12rem]">{fulfillment.merchant}</td>
      <td className="px-6 py-4 text-sm text-gray-700 max-w-[24rem]">
        <div className="truncate" title={fulfillment.items}>
          {fulfillment.items}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={fulfillment.pickupStatus} type="pickup" />
      </td>
      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap truncate max-w-[12rem]">{fulfillment.deliveryPartner}</td>
      <td className="px-6 py-4 text-sm whitespace-nowrap truncate max-w-[12rem]">
        {fulfillment.rider === 'Unassigned' ? (
          <span className="text-gray-400 italic">Unassigned</span>
        ) : (
          <span className="text-gray-900 font-medium">{fulfillment.rider}</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={fulfillment.deliveryStatus} type="delivery" />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNotifyMerchant(fulfillment.id)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            title="Notify Merchant"
          >
            <Bell className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
          </button>
          <button
            onClick={() => onAssignRider(fulfillment.id)}
            disabled={fulfillment.rider !== 'Unassigned'}
            className={`p-2 rounded-lg transition-colors group ${
              fulfillment.rider === 'Unassigned'
                ? 'hover:bg-green-50'
                : 'opacity-50 cursor-not-allowed'
            }`}
            title="Assign Rider"
          >
            <UserPlus className={`w-4 h-4 ${
              fulfillment.rider === 'Unassigned'
                ? 'text-gray-600 group-hover:text-green-600'
                : 'text-gray-400'
            }`} />
          </button>
          <button
            onClick={() => onGenerateWaybill(fulfillment.id)}
            className="p-2 hover:bg-purple-50 rounded-lg transition-colors group"
            title="Generate Waybill"
          >
            <FileText className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Main Fulfillment Page Component
const FulfillmentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pickupFilter, setPickupFilter] = useState('All');
  const [deliveryFilter, setDeliveryFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const handleNotifyMerchant = (orderId: string) => {
    console.log(`Notifying merchant for order: ${orderId}`);
    alert(`Notification sent to merchant for ${orderId}`);
  };

  const handleAssignRider = (orderId: string) => {
    console.log(`Assigning rider for order: ${orderId}`);
    alert(`Opening rider assignment dialog for ${orderId}`);
  };

  const handleGenerateWaybill = (orderId: string) => {
    console.log(`Generating waybill for order: ${orderId}`);
    alert(`Waybill generated for ${orderId}`);
  };

  const filteredFulfillments = mockFulfillments.filter(fulfillment => {
    const matchesSearch = fulfillment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fulfillment.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fulfillment.items.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPickup = pickupFilter === 'All' || fulfillment.pickupStatus === pickupFilter;
    const matchesDelivery = deliveryFilter === 'All' || fulfillment.deliveryStatus === deliveryFilter;
    
    return matchesSearch && matchesPickup && matchesDelivery;
  });

  const pickupStatuses = ['All', 'Pending', 'Ready for Pickup', 'Picked Up'];
  const deliveryStatuses = ['All', 'Awaiting Merchant', 'Awaiting Pickup', 'In Transit', 'Out for Delivery'];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Fulfillment</h1>
          </div>
          <p className="text-gray-600">Manage procurement, pickup, and delivery operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-gray-600" />
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockFulfillments.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-gray-600">Pending Pickup</p>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {mockFulfillments.filter(f => f.pickupStatus === 'Pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600">In Transit</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {mockFulfillments.filter(f => f.deliveryStatus === 'In Transit').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <p className="text-sm text-gray-600">Unassigned Riders</p>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {mockFulfillments.filter(f => f.rider === 'Unassigned').length}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, merchant, or items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Status</label>
                <select
                  value={pickupFilter}
                  onChange={(e) => setPickupFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {pickupStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Status</label>
                <select
                  value={deliveryFilter}
                  onChange={(e) => setDeliveryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {deliveryStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Fulfillment Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-28 px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Order ID
                  </th>
                  <th className="w-48 px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Merchant
                  </th>
                  <th className="w-80 px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="w-36 px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Pickup Status
                  </th>
                  <th className="w-44 px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Delivery Partner
                  </th>
                  <th className="w-44 px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Rider
                  </th>
                  <th className="w-36 px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Delivery Status
                  </th>
                  <th className="w-32 px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFulfillments.length > 0 ? (
                  filteredFulfillments.map(fulfillment => (
                    <FulfillmentRow 
                      key={fulfillment.id} 
                      fulfillment={fulfillment}
                      onNotifyMerchant={handleNotifyMerchant}
                      onAssignRider={handleAssignRider}
                      onGenerateWaybill={handleGenerateWaybill}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No fulfillment records found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredFulfillments.length} of {mockFulfillments.length} orders
        </div>
      </div>
    </div>
  );
};

export default FulfillmentPage;