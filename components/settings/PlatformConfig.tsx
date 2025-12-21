'use client';

import React, { useState } from 'react';
import { Clock, MapPin, DollarSign, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { DeliveryZone, ConfigData } from '@/Types/types';

const SettingsSection = ({ 
  title, 
  icon: Icon, 
  children 
}: { 
  title: string; 
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="bg-blue-50 p-2 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default function PlatformConfigPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [config, setConfig] = useState<ConfigData>({
    businessHours: {
      enabled: true,
      openTime: '09:00',
      closeTime: '18:00',
    },
    deliveryZones: [
      { id: 'zone-1', name: 'Central Business District', rate: 1500, enabled: true },
      { id: 'zone-2', name: 'Mainland', rate: 2500, enabled: true },
      { id: 'zone-3', name: 'Island', rate: 3000, enabled: true },
      { id: 'zone-4', name: 'Outskirts', rate: 5000, enabled: false },
    ],
    defaultDeliveryFee: 2000,
    orderCutoff: {
      enabled: true,
      time: '20:00',
    },
    autoConfirmOrders: false,
    allowWeekendDelivery: true,
  });

  const handleSaveChanges = () => {
    setShowSuccess(true);
    setHasChanges(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const updateConfig = (updates: Partial<ConfigData>) => {
    setConfig({ ...config, ...updates });
    setHasChanges(true);
  };

  const updateDeliveryZone = (zoneId: string, updates: Partial<DeliveryZone>) => {
    const updatedZones = config.deliveryZones.map(zone =>
      zone.id === zoneId ? { ...zone, ...updates } : zone
    );
    updateConfig({ deliveryZones: updatedZones });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Configuration</h1>
            <p className="text-gray-600 mt-2">Control how your platform operates</p>
          </div>
          <button
            onClick={handleSaveChanges}
            disabled={!hasChanges}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-sm font-medium text-green-800">
              Configuration saved successfully!
            </p>
          </div>
        )}

        {/* Changes Warning */}
        {hasChanges && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <p className="text-sm font-medium text-yellow-800">
              You have unsaved changes. Click `Save Changes` to apply them.
            </p>
          </div>
        )}

        {/* Business Hours Section */}
        <SettingsSection title="Business Hours" icon={Clock}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Enable Business Hours</p>
                <p className="text-sm text-gray-600">Orders will only be accepted during business hours</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.businessHours.enabled}
                  onChange={(e) => updateConfig({
                    businessHours: { ...config.businessHours, enabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {config.businessHours.enabled && (
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={config.businessHours.openTime}
                    onChange={(e) => updateConfig({
                      businessHours: { ...config.businessHours, openTime: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={config.businessHours.closeTime}
                    onChange={(e) => updateConfig({
                      businessHours: { ...config.businessHours, closeTime: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </SettingsSection>

        {/* Delivery Zones Section */}
        <SettingsSection title="Delivery Zones & Rates" icon={MapPin}>
          <div className="space-y-4">
            {config.deliveryZones.map((zone) => (
              <div key={zone.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={zone.enabled}
                      onChange={(e) => updateDeliveryZone(zone.id, { enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{zone.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rate:</span>
                  <input
                    type="number"
                    value={zone.rate}
                    onChange={(e) => updateDeliveryZone(zone.id, { rate: Number(e.target.value) })}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!zone.enabled}
                  />
                  <span className="text-sm text-gray-600">₦</span>
                </div>
              </div>
            ))}
          </div>
        </SettingsSection>

        {/* Default Delivery Fee Section */}
        <SettingsSection title="Default Delivery Fee" icon={DollarSign}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Fee (when zone is not specified)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">₦</span>
                <input
                  type="number"
                  value={config.defaultDeliveryFee}
                  onChange={(e) => updateConfig({ defaultDeliveryFee: Number(e.target.value) })}
                  className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This fee will be applied when customer location does not match any specific zone
              </p>
            </div>
          </div>
        </SettingsSection>

        {/* Order Cutoff Section */}
        <SettingsSection title="Order Cutoff Time" icon={Clock}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Enable Order Cutoff</p>
                <p className="text-sm text-gray-600">Stop accepting orders after a specific time</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.orderCutoff.enabled}
                  onChange={(e) => updateConfig({
                    orderCutoff: { ...config.orderCutoff, enabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {config.orderCutoff.enabled && (
              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cutoff Time
                </label>
                <input
                  type="time"
                  value={config.orderCutoff.time}
                  onChange={(e) => updateConfig({
                    orderCutoff: { ...config.orderCutoff, time: e.target.value }
                  })}
                  className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </SettingsSection>

        {/* Additional Settings Section */}
        <SettingsSection title="Additional Settings" icon={AlertCircle}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Auto-Confirm Orders</p>
                <p className="text-sm text-gray-600">Automatically confirm orders without manual review</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.autoConfirmOrders}
                  onChange={(e) => updateConfig({ autoConfirmOrders: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Allow Weekend Delivery</p>
                <p className="text-sm text-gray-600">Enable delivery services on Saturdays and Sundays</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.allowWeekendDelivery}
                  onChange={(e) => updateConfig({ allowWeekendDelivery: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}