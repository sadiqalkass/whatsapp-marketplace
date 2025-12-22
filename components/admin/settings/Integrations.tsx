'use client';

import React, { useState } from 'react';
import { MessageSquare, CreditCard, Truck, CheckCircle, XCircle, Clock, Play, Link, Unlink } from 'lucide-react';
import { Integration } from '@/Types/types';

const IntegrationCard = ({ 
  integration, 
  onConnect, 
  onDisconnect, 
  onTest 
}: { 
  integration: Integration;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onTest: (id: string) => void;
}) => {
  const Icon = integration.icon;
  
  const getStatusColor = (status: string) => {
    if (status === 'Connected') return 'text-green-600 bg-green-50';
    if (status === 'Error') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Connected') return <CheckCircle className="w-4 h-4" />;
    if (status === 'Error') return <XCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border-2 border-transparent hover:border-blue-200 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(integration.status)}`}>
          {getStatusIcon(integration.status)}
          <span className="text-xs font-medium">{integration.status}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Last Sync:</span>
          <span className="text-gray-900 font-medium">{integration.lastSync}</span>
        </div>
        {integration.details.version && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Version:</span>
            <span className="text-gray-900 font-medium">{integration.details.version}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200">
        {integration.status === 'Connected' ? (
          <>
            <button
              onClick={() => onTest(integration.id)}
              className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-100 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Test Connection
            </button>
            <button
              onClick={() => onDisconnect(integration.id)}
              className="flex-1 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-md hover:bg-red-100 flex items-center justify-center gap-2"
            >
              <Unlink className="w-4 h-4" />
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={() => onConnect(integration.id)}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Link className="w-4 h-4" />
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'whatsapp-api',
      name: 'WhatsApp Business API',
      description: 'Core messaging platform for customer communication',
      category: 'Communication',
      status: 'Connected',
      lastSync: '2024-12-21 10:30 AM',
      icon: MessageSquare,
      details: {
        apiKey: '••••••••••••3x7k',
        endpoint: 'https://api.whatsapp.com/v1',
        version: 'v2.0',
      },
    },
    {
      id: 'paystack',
      name: 'Paystack Payment Gateway',
      description: 'Process payments and manage transactions',
      category: 'Payment',
      status: 'Connected',
      lastSync: '2024-12-21 09:15 AM',
      icon: CreditCard,
      details: {
        apiKey: '••••••••••••9m2p',
        version: 'v3.1',
      },
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      description: 'Alternative payment processing',
      category: 'Payment',
      status: 'Disconnected',
      lastSync: 'Never',
      icon: CreditCard,
      details: {
        version: 'v3.0',
      },
    },
    {
      id: 'gokada',
      name: 'Gokada Delivery',
      description: 'Last-mile delivery partner for Lagos',
      category: 'Delivery',
      status: 'Connected',
      lastSync: '2024-12-21 08:45 AM',
      icon: Truck,
      details: {
        apiKey: '••••••••••••5h8n',
        version: 'v1.2',
      },
    },
    {
      id: 'kwik',
      name: 'Kwik Delivery',
      description: 'On-demand delivery services',
      category: 'Delivery',
      status: 'Error',
      lastSync: '2024-12-20 05:30 PM',
      icon: Truck,
      details: {
        apiKey: '••••••••••••4k9l',
        version: 'v2.0',
      },
    },
    {
      id: 'sendchamp',
      name: 'SendChamp',
      description: 'Backup messaging service',
      category: 'Communication',
      status: 'Disconnected',
      lastSync: 'Never',
      icon: MessageSquare,
      details: {
        version: 'v1.0',
      },
    },
  ]);

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const handleConnect = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    setSelectedIntegration(integration || null);
    setShowConfigModal(true);
  };

  const handleDisconnect = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (window.confirm(`Are you sure you want to disconnect ${integration?.name}?`)) {
      setIntegrations(integrations.map(i =>
        i.id === id ? { ...i, status: 'Disconnected' as Integration['status'], lastSync: 'Never' } : i
      ));
      alert(`${integration?.name} disconnected successfully`);
    }
  };

  const handleTest = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    alert(`Testing connection to ${integration?.name}...\n\nConnection test successful! ✓`);
  };

  const handleSaveConnection = () => {
    if (selectedIntegration) {
      setIntegrations(integrations.map(i =>
        i.id === selectedIntegration.id 
          ? { ...i, status: 'Connected' as Integration['status'], lastSync: new Date().toLocaleString() } 
          : i
      ));
      setShowConfigModal(false);
      setSelectedIntegration(null);
      alert('Integration connected successfully!');
    }
  };

  const getIntegrationsByCategory = (category: string) => {
    return integrations.filter(i => i.category === category);
  };

  const connectedCount = integrations.filter(i => i.status === 'Connected').length;
  const errorCount = integrations.filter(i => i.status === 'Error').length;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-2">Manage external service connections</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Integrations</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{integrations.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <Link className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connected</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{connectedCount}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Issues</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{errorCount}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Communication Integrations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Communication
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getIntegrationsByCategory('Communication').map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onTest={handleTest}
              />
            ))}
          </div>
        </div>

        {/* Payment Integrations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Payment Gateways
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getIntegrationsByCategory('Payment').map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onTest={handleTest}
              />
            ))}
          </div>
        </div>

        {/* Delivery Integrations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            Delivery Partners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getIntegrationsByCategory('Delivery').map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onTest={handleTest}
              />
            ))}
          </div>
        </div>

        {/* Info Box */}
        {errorCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-red-900">Integration Issues Detected</p>
                <p className="text-sm text-red-700 mt-1">
                  {errorCount} integration(s) have connection issues. Please review and reconnect them to ensure smooth operations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Modal */}
        {showConfigModal && selectedIntegration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  {React.createElement(selectedIntegration.icon, { className: "w-6 h-6 text-blue-600" })}
                  <h2 className="text-2xl font-bold text-gray-900">{selectedIntegration.name}</h2>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key *
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your API key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Secret *
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your API secret"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {selectedIntegration.category === 'Payment' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://your-domain.com/webhook"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    Your credentials are encrypted and stored securely. They will only be used to connect to {selectedIntegration.name}.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveConnection}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}