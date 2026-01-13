'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Search, Filter, Bell, UserPlus, FileText, ChevronDown, Package, CheckCircle, Clock, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { fulfillmentService } from '@/services/fulfillment.service';
import toast from 'react-hot-toast';

// Types based on your API response
interface ApiFulfillment {
  id: string;
  deliveryId?: string;
  orderId: string;
  orderNumber: string;
  merchant: {
    name: string;
    phone?: string;
    address?: string;
  };
  customer?: {
    name: string;
    address?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
  }>;
  rider?: {
    id: string;
    name: string;
  };
  status: string;
  paymentStatus?: string;
  totalAmount?: number;
  deliveryFee?: number;
  createdAt: string;
  updatedAt?: string;
}

interface FulfillmentStats {
  totalDeliveries: number;
  pending: number;
  assigned: number;
  picked_up: number;
  in_transit: number;
  delivered: number;
  cancelled: number;
  failed: number;
  todayDeliveries: number;
}

type Fulfillment = { 
  id: string; 
  merchant: string; 
  items: string; 
  pickupStatus: string; 
  deliveryPartner: string; 
  rider: string; 
  deliveryStatus: string;
  apiData: ApiFulfillment; // Store original API data
};

// Helper function to format API data to local format
const formatFulfillment = (apiFulfillment: ApiFulfillment): Fulfillment => {
  // Map API status to local pickup/delivery statuses
  const getPickupStatus = (status: string): string => {
    switch (status) {
      case 'pending':
      case 'assigned':
        return 'Pending';
      case 'picked_up':
        return 'Picked Up';
      default:
        return 'Pending';
    }
  };

  const getDeliveryStatus = (status: string): string => {
    switch (status) {
      case 'pending':
      case 'assigned':
        return 'Awaiting Pickup';
      case 'picked_up':
        return 'Ready for Pickup';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Out for Delivery'; // Assuming 'delivered' means out for delivery in your UI
      default:
        return 'Awaiting Merchant';
    }
  };

  const formatItems = (items: Array<{name: string; quantity: number}>): string => {
    return items.map(item => 
      item.quantity > 1 ? `${item.name} (x${item.quantity})` : item.name
    ).join(', ');
  };

  return {
    id: apiFulfillment.orderNumber || apiFulfillment.id,
    merchant: apiFulfillment.merchant.name,
    items: formatItems(apiFulfillment.items),
    pickupStatus: getPickupStatus(apiFulfillment.status),
    deliveryPartner: 'QuickShip', // Default - you might want to get this from API
    rider: apiFulfillment.rider?.name || 'Unassigned',
    deliveryStatus: getDeliveryStatus(apiFulfillment.status),
    apiData: apiFulfillment,
  };
};

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

type FulfillmentRowProps = { 
  fulfillment: Fulfillment; 
  onNotifyMerchant: (id: string, apiData: ApiFulfillment) => void; 
  onAssignRider: (id: string, apiData: ApiFulfillment) => void; 
  onGenerateWaybill: (id: string, apiData: ApiFulfillment) => void;
};
const FulfillmentRow: React.FC<FulfillmentRowProps> = ({ 
  fulfillment, 
  onNotifyMerchant, 
  onAssignRider, 
  onGenerateWaybill 
}) => {
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
            onClick={() => onNotifyMerchant(fulfillment.id, fulfillment.apiData)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            title="Notify Merchant"
          >
            <Bell className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
          </button>
          <button
            onClick={() => onAssignRider(fulfillment.id, fulfillment.apiData)}
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
            onClick={() => onGenerateWaybill(fulfillment.id, fulfillment.apiData)}
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

// Mock rider data (you might want to fetch this from API)
const availableRiders = [
  { id: 'R001', name: 'Ahmed Kamaldeen' },
  { id: 'R002', name: 'Fatima Bello' },
  { id: 'R003', name: 'Chinedu Okafor' },
  { id: 'R004', name: 'Musa Ibrahim' },
  { id: 'R005', name: 'Grace Williams' },
];

// Main Fulfillment Page Component
const FulfillmentPage: React.FC = () => {
  const [fulfillments, setFulfillments] = useState<Fulfillment[]>([]);
  const [apiFulfillments, setApiFulfillments] = useState<ApiFulfillment[]>([]);
  const [stats, setStats] = useState<FulfillmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pickupFilter, setPickupFilter] = useState('All');
  const [deliveryFilter, setDeliveryFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedFulfillment, setSelectedFulfillment] = useState<ApiFulfillment | null>(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [selectedRiderId, setSelectedRiderId] = useState('');

  // Fetch fulfillments and stats on component mount
  const fetchFulfillments = async () => {
    try {
      setLoading(true);
      const data = await fulfillmentService.getAllFulfillments();
      setApiFulfillments(data);
      setFulfillments(data.map(formatFulfillment));
    } catch (error) {
      console.error('Failed to fetch fulfillments:', error);
      toast.error('Failed to load fulfillment data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const data = await fulfillmentService.getFulfillmentStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchFulfillments();
    fetchStats();
  }, []);

  const handleNotifyMerchant = async (orderId: string, apiData: ApiFulfillment) => {
    console.log(`Notifying merchant for order: ${orderId}`);
    
    try {
      // Use the delivery ID from API data
      const deliveryId = apiData.deliveryId || apiData.id;
      await fulfillmentService.notifyMerchant(deliveryId);
      
      toast.success(`Notification sent to merchant for ${orderId}`);
      
      // Refresh data
      setRefreshing(true);
      await fetchFulfillments();
    } catch (error) {
      console.error('Failed to notify merchant:', error);
      toast.error('Failed to send notification. Please try again.');
    }
  };

  const handleAssignRider = (orderId: string, apiData: ApiFulfillment) => {
    console.log(`Assigning rider for order: ${orderId}`);
    setSelectedFulfillment(apiData);
    setShowAssignModal(true);
  };

  const handleGenerateWaybill = async (orderId: string, apiData: ApiFulfillment) => {
    console.log(`Generating waybill for order: ${orderId}`);
    
    try {
      // Fetch delivery details first
      const deliveryId = apiData.deliveryId || apiData.id;
      const deliveryDetails = await fulfillmentService.getDeliveryById(deliveryId);
      
      // Generate waybill data
      const waybillData = {
        orderId: orderId,
        deliveryId: deliveryId,
        merchant: apiData.merchant.name,
        customer: apiData.customer?.name || 'N/A',
        items: apiData.items,
        createdAt: apiData.createdAt,
        // Add other waybill details as needed
      };
      
      console.log('Waybill data:', waybillData);
      toast.success(`Waybill generated for ${orderId}. Check console for details.`);
      
      // In a real app, you might:
      // 1. Generate a PDF
      // 2. Send to printer
      // 3. Download file
      // 4. Open in new window
    } catch (error) {
      console.error('Failed to generate waybill:', error);
      toast.error('Failed to generate waybill. Please try again.');
    }
  };

  const handleAssignRiderConfirm = async () => {
    if (!selectedFulfillment || !selectedRiderId) return;

    setAssignLoading(true);
    try {
      const deliveryId = selectedFulfillment.deliveryId || selectedFulfillment.id;
      await fulfillmentService.assignRider(deliveryId, selectedRiderId);
      
      toast.success(`Rider assigned successfully to order ${selectedFulfillment.orderNumber}`);
      
      // Refresh data
      setRefreshing(true);
      await fetchFulfillments();
      
      // Close modal
      setShowAssignModal(false);
      setSelectedFulfillment(null);
      setSelectedRiderId('');
    } catch (error) {
      console.error('Failed to assign rider:', error);
      toast.error('Failed to assign rider. Please try again.');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchFulfillments(), fetchStats()]);
  };

  const filteredFulfillments = fulfillments.filter(fulfillment => {
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
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">Fulfillment</h1>
              {refreshing && (
                <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
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
            {loadingStats ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900">{stats?.totalDeliveries || 0}</p>
            )}
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-gray-600">Pending Pickup</p>
            </div>
            {loadingStats ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-2xl font-bold text-yellow-600">
                {stats?.pending || 0}
              </p>
            )}
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600">In Transit</p>
            </div>
            {loadingStats ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-2xl font-bold text-green-600">
                {stats?.in_transit || 0}
              </p>
            )}
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <p className="text-sm text-gray-600">Unassigned Riders</p>
            </div>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-2xl font-bold text-orange-600">
                {fulfillments.filter(f => f.rider === 'Unassigned').length}
              </p>
            )}
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
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Loading fulfillment data...</p>
            </div>
          ) : (
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
                        {searchTerm || pickupFilter !== 'All' || deliveryFilter !== 'All'
                          ? 'No fulfillment records found matching your criteria'
                          : 'No fulfillment records found'
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {!loading && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredFulfillments.length} of {fulfillments.length} orders
            {filteredFulfillments.length > 0 && (
              <span className="ml-4">
                • {filteredFulfillments.filter(f => f.pickupStatus === 'Pending').length} pending pickup
                • {filteredFulfillments.filter(f => f.deliveryStatus === 'In Transit').length} in transit
                • {filteredFulfillments.filter(f => f.rider === 'Unassigned').length} need rider assignment
              </span>
            )}
          </div>
        )}

        {/* Assign Rider Modal */}
        {showAssignModal && selectedFulfillment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Assign Rider</h3>
              <p className="text-sm text-gray-600 mb-4">
                Assign a rider for order <strong>{selectedFulfillment.orderNumber}</strong>
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Rider
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableRiders.map((rider) => (
                    <label
                      key={rider.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedRiderId === rider.id 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="rider"
                        value={rider.id}
                        checked={selectedRiderId === rider.id}
                        onChange={(e) => setSelectedRiderId(e.target.value)}
                        className="text-green-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{rider.name}</div>
                        <div className="text-xs text-gray-500">ID: {rider.id}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedFulfillment(null);
                    setSelectedRiderId('');
                  }}
                  disabled={assignLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignRiderConfirm}
                  disabled={!selectedRiderId || assignLoading}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
                    selectedRiderId && !assignLoading
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {assignLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    'Assign Rider'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FulfillmentPage;