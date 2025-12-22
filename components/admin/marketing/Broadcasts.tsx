'use client';

import React, { useState } from 'react';
import { Send, Plus, Users, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Broadcast, StatusBadgeProps } from '@/Types/types';

const StatusBadge = ({ status, type = 'neutral' }: StatusBadgeProps) => {
  const colors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type]}`}>
      {status}
    </span>
  );
};

const mockBroadcasts: Broadcast[] = [
  {
    id: 'BC-001',
    name: 'Weekend Flash Sale',
    targetSegment: 'Active Customers',
    messageType: 'Promotional',
    status: 'Sent',
    sentDate: '2024-12-20',
    recipientCount: 1250,
    deliveryRate: 98,
  },
  {
    id: 'BC-002',
    name: 'New Product Launch',
    targetSegment: 'VIP Customers',
    messageType: 'Update',
    status: 'Scheduled',
    sentDate: '2024-12-22',
    recipientCount: 450,
  },
  {
    id: 'BC-003',
    name: 'Cart Abandonment Reminder',
    targetSegment: 'Abandoned Carts',
    messageType: 'Reminder',
    status: 'Draft',
    sentDate: '-',
    recipientCount: 320,
  },
  {
    id: 'BC-004',
    name: 'Holiday Special Offer',
    targetSegment: 'All Customers',
    messageType: 'Promotional',
    status: 'Sent',
    sentDate: '2024-12-18',
    recipientCount: 3200,
    deliveryRate: 96,
  },
];

const customerSegments = [
  { id: 'active', name: 'Active Customers', count: 1250 },
  { id: 'vip', name: 'VIP Customers', count: 450 },
  { id: 'abandoned', name: 'Abandoned Carts', count: 320 },
  { id: 'all', name: 'All Customers', count: 3200 },
  { id: 'new', name: 'New Customers', count: 580 },
];

const messageTemplates = [
  { id: 'promo-1', name: 'Flash Sale Template', category: 'Promotional' },
  { id: 'update-1', name: 'Product Launch Template', category: 'Update' },
  { id: 'reminder-1', name: 'Cart Reminder Template', category: 'Reminder' },
  { id: 'welcome-1', name: 'Welcome Message', category: 'Welcome' },
];

export default function BroadcastsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [broadcasts, setBroadcasts] = useState(mockBroadcasts);
  const [formData, setFormData] = useState({
    name: '',
    segment: '',
    template: '',
    scheduleType: 'now',
    scheduleDate: '',
    scheduleTime: '',
  });

  const getStatusType = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    if (status === 'Sent') return 'success';
    if (status === 'Scheduled') return 'info';
    if (status === 'Draft') return 'neutral';
    return 'neutral';
  };

  const handleCreateBroadcast = () => {
    const selectedSegment = customerSegments.find(s => s.id === formData.segment);
    const selectedTemplate = messageTemplates.find(t => t.id === formData.template);
    
    if (!formData.name || !selectedSegment || !selectedTemplate) {
      alert('Please fill in all required fields');
      return;
    }

    const newBroadcast: Broadcast = {
      id: `BC-${String(broadcasts.length + 1).padStart(3, '0')}`,
      name: formData.name,
      targetSegment: selectedSegment.name,
      messageType: selectedTemplate.category,
      status: formData.scheduleType === 'now' ? 'Sent' : 'Scheduled',
      sentDate: formData.scheduleType === 'now' ? new Date().toISOString().split('T')[0] : formData.scheduleDate,
      recipientCount: selectedSegment.count,
      deliveryRate: formData.scheduleType === 'now' ? 100 : undefined,
    };

    setBroadcasts([newBroadcast, ...broadcasts]);
    setShowCreateModal(false);
    setFormData({
      name: '',
      segment: '',
      template: '',
      scheduleType: 'now',
      scheduleDate: '',
      scheduleTime: '',
    });
    alert(`Broadcast ${formData.scheduleType === 'now' ? 'sent' : 'scheduled'} successfully!`);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Broadcast Campaigns</h1>
            <p className="text-gray-600 mt-2">Send targeted WhatsApp messages to customer segments</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Broadcast
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Broadcasts</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{broadcasts.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {broadcasts.filter(b => b.status === 'Sent').length}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {broadcasts.filter(b => b.status === 'Scheduled').length}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {broadcasts.filter(b => b.status === 'Draft').length}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Broadcasts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Broadcasts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Broadcast Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target Segment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {broadcasts.map((broadcast) => (
                  <tr key={broadcast.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {broadcast.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        {broadcast.targetSegment}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {broadcast.messageType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {broadcast.recipientCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={broadcast.status} type={getStatusType(broadcast.status)} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {broadcast.sentDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {broadcast.deliveryRate ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${broadcast.deliveryRate}%` }}
                            />
                          </div>
                          <span className="text-gray-600 text-xs">{broadcast.deliveryRate}%</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Broadcast Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Broadcast</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Broadcast Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Broadcast Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Weekend Flash Sale"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Customer Segment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Customer Segment *
                  </label>
                  <select
                    value={formData.segment}
                    onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a segment</option>
                    {customerSegments.map((segment) => (
                      <option key={segment.id} value={segment.id}>
                        {segment.name} ({segment.count.toLocaleString()} customers)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Template */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Message Template *
                  </label>
                  <select
                    value={formData.template}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a template</option>
                    {messageTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} - {template.category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Schedule Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule
                  </label>
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="now"
                        checked={formData.scheduleType === 'now'}
                        onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value })}
                        className="mr-2"
                      />
                      Send Now
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="later"
                        checked={formData.scheduleType === 'later'}
                        onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value })}
                        className="mr-2"
                      />
                      Schedule for Later
                    </label>
                  </div>

                  {formData.scheduleType === 'later' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={formData.scheduleDate}
                          onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <input
                          type="time"
                          value={formData.scheduleTime}
                          onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBroadcast}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {formData.scheduleType === 'now' ? 'Send Now' : 'Schedule Broadcast'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}