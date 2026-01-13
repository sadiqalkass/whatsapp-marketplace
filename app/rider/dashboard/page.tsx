'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { riderService } from '@/services/rider.service';
import DeliveryMap from '@/components/rider/DeliverMap';

import { 
  Power, 
  MapPin, 
  Package, 
  CheckCircle, 
  Truck,
  LogOut,
  User
} from 'lucide-react';

type RiderStatus = 'OFFLINE' | 'AVAILABLE' | 'BUSY';
type DeliveryStatus = 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';

interface Delivery {
  id: string;
  deliveryNumber: string;
  status: DeliveryStatus;
  pickupAddress: string;
  deliveryAddress: string;
  recipientName: string;
  recipientPhone: string;
  deliveryFee: number;
  createdAt: string;
  order: {
    orderNumber: string;
    totalAmount: number;
  };
}

interface RiderProfile {
  firstName: string;
  lastName: string;
  status: RiderStatus;
  rating: number;
  totalDeliveries: number;
  vehicleType: string;
}

export default function RiderDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<RiderProfile | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, deliveriesRes] = await Promise.all([
        riderService.getProfile(),
        riderService.getMyDeliveries(),
      ]);

      setProfile(profileRes.data);
      setDeliveries(deliveriesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!profile) return;

    setUpdatingStatus(true);
    try {
      const newStatus = profile.status === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';
      await riderService.updateStatus(newStatus);
      await fetchData();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeliveryAction = async (deliveryId: string, newStatus: 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED') => {
    try {
      await riderService.updateDeliveryStatus(deliveryId, newStatus);
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update delivery');
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Truck className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: RiderStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-500';
      case 'BUSY':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDeliveryStatusBadge = (status: DeliveryStatus) => {
    const colors = {
      ASSIGNED: 'bg-blue-100 text-blue-800',
      PICKED_UP: 'bg-yellow-100 text-yellow-800',
      IN_TRANSIT: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className="text-blue-100 text-sm">{profile?.vehicleType}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toggle */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(profile?.status || 'OFFLINE')}`} />
              <span className="font-medium">
                {profile?.status === 'AVAILABLE' ? 'Online' : 'Offline'}
              </span>
            </div>
            <button
              onClick={handleStatusToggle}
              disabled={updatingStatus || profile?.status === 'BUSY'}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                profile?.status === 'AVAILABLE'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Power className="w-4 h-4 inline mr-2" />
              {profile?.status === 'AVAILABLE' ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Total Deliveries</p>
            <p className="text-2xl font-bold">{profile?.totalDeliveries || 0}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Rating</p>
            <p className="text-2xl font-bold">⭐ {profile?.rating.toFixed(1) || '0.0'}</p>
          </div>
        </div>
      </div>

      {/* Active Deliveries */}
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Active Deliveries ({deliveries.length})
        </h2>

        {deliveries.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No active deliveries</p>
            <p className="text-sm text-gray-400 mt-1">
              {profile?.status === 'AVAILABLE'
                ? 'Wait for new deliveries to arrive'
                : 'Go online to receive deliveries'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-900">
                    #{delivery.deliveryNumber}
                  </span>
                  {getDeliveryStatusBadge(delivery.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-700">Pickup</p>
                      <p className="text-gray-600">{delivery.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-700">Delivery</p>
                      <p className="text-gray-600">{delivery.deliveryAddress}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {delivery.recipientName} • {delivery.recipientPhone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Map */}
                <div className='mb-4'>
                  <DeliveryMap
                    pickupLat={6.5244}
                    pickupLng={3.3792}
                    deliveryLat={6.4281}
                    deliveryLng={3.4214}
                  />
                </div>

                <div className="flex items-center gap-2">
                  {delivery.status === 'ASSIGNED' && (
                    <button
                      onClick={() => handleDeliveryAction(delivery.id, 'PICKED_UP')}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Mark Picked Up
                    </button>
                  )}
                  {delivery.status === 'PICKED_UP' && (
                    <button
                      onClick={() => handleDeliveryAction(delivery.id, 'IN_TRANSIT')}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Truck className="w-4 h-4 inline mr-2" />
                      Start Delivery
                    </button>
                  )}
                  {delivery.status === 'IN_TRANSIT' && (
                    <button
                      onClick={() => handleDeliveryAction(delivery.id, 'DELIVERED')}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}