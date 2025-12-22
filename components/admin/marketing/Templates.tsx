'use client';

import React, { useState } from 'react';
import { Plus, Eye, Edit, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import { Template, StatusBadgeProps } from '../../../Types/types';

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

const mockTemplates: Template[] = [
  {
    id: 'TPL-001',
    name: 'Flash Sale Announcement',
    category: 'Promotions',
    approvalStatus: 'Approved',
    lastUpdated: '2024-12-15',
    content: 'Hi {{customer_name}}! 🎉 Flash Sale Alert! Get {{discount}}% off on {{product_category}}. Valid until {{expiry_date}}. Shop now: {{shop_link}}',
    variables: ['customer_name', 'discount', 'product_category', 'expiry_date', 'shop_link'],
  },
  {
    id: 'TPL-002',
    name: 'Order Confirmation',
    category: 'Alerts',
    approvalStatus: 'Approved',
    lastUpdated: '2024-12-18',
    content: 'Hello {{customer_name}}, your order #{{order_id}} has been confirmed! Total: {{amount}}. Expected delivery: {{delivery_date}}. Track: {{tracking_link}}',
    variables: ['customer_name', 'order_id', 'amount', 'delivery_date', 'tracking_link'],
  },
  {
    id: 'TPL-003',
    name: 'New Product Launch',
    category: 'Updates',
    approvalStatus: 'Pending',
    lastUpdated: '2024-12-20',
    content: 'Exciting news {{customer_name}}! We just launched {{product_name}}. Be the first to try it! {{product_link}}',
    variables: ['customer_name', 'product_name', 'product_link'],
  },
  {
    id: 'TPL-004',
    name: 'Cart Abandonment Reminder',
    category: 'Alerts',
    approvalStatus: 'Approved',
    lastUpdated: '2024-12-10',
    content: 'Hi {{customer_name}}, you left {{item_count}} items in your cart. Complete your purchase now and get {{discount}}% off! {{cart_link}}',
    variables: ['customer_name', 'item_count', 'discount', 'cart_link'],
  },
  {
    id: 'TPL-005',
    name: 'Welcome New Customer',
    category: 'Welcome',
    approvalStatus: 'Rejected',
    lastUpdated: '2024-12-08',
    content: 'Welcome to {{store_name}}, {{customer_name}}! Here\'s a special {{discount}}% discount on your first order. Use code: {{code}}',
    variables: ['store_name', 'customer_name', 'discount', 'code'],
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Promotions' as Template['category'],
    content: '',
  });

  const getStatusType = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    if (status === 'Approved') return 'success';
    if (status === 'Pending') return 'warning';
    if (status === 'Rejected') return 'error';
    return 'neutral';
  };

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleEdit = (template: Template) => {
    setFormData({
      name: template.name,
      category: template.category,
      content: template.content,
    });
    setSelectedTemplate(template);
    setIsEditing(true);
    setShowCreateModal(true);
  };

  const handleSubmitForApproval = (template: Template) => {
    alert(`Template "${template.name}" submitted for WhatsApp approval!`);
  };

  const handleSaveTemplate = () => {
    if (!formData.name || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    const variables = formData.content.match(/\{\{(.*?)\}\}/g)?.map(v => v.replace(/\{\{|\}\}/g, '')) || [];

    if (isEditing && selectedTemplate) {
      setTemplates(templates.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, ...formData, variables, lastUpdated: new Date().toISOString().split('T')[0] }
          : t
      ));
      alert('Template updated successfully!');
    } else {
      const newTemplate: Template = {
        id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
        ...formData,
        approvalStatus: 'Pending',
        lastUpdated: new Date().toISOString().split('T')[0],
        variables,
      };
      setTemplates([newTemplate, ...templates]);
      alert('Template created successfully!');
    }

    setShowCreateModal(false);
    setIsEditing(false);
    setSelectedTemplate(null);
    setFormData({ name: '', category: 'Promotions', content: '' });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Message Templates</h1>
            <p className="text-gray-600 mt-2">Manage WhatsApp-approved message templates</p>
          </div>
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({ name: '', category: 'Promotions', content: '' });
              setShowCreateModal(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Template
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Templates</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{templates.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {templates.filter(t => t.approvalStatus === 'Approved').length}
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
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {templates.filter(t => t.approvalStatus === 'Pending').length}
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
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {templates.filter(t => t.approvalStatus === 'Rejected').length}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Templates Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Templates</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approval Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variables
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {template.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {template.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge 
                        status={template.approvalStatus} 
                        type={getStatusType(template.approvalStatus)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {template.lastUpdated}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-wrap gap-1">
                        {template.variables.slice(0, 2).map((variable, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded">
                            {variable}
                          </span>
                        ))}
                        {template.variables.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                            +{template.variables.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePreview(template)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(template)}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {template.approvalStatus !== 'Pending' && (
                          <button
                            onClick={() => handleSubmitForApproval(template)}
                            className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded hover:bg-yellow-200"
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Template Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Template Name</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Category</p>
                  <p className="text-gray-900">{selectedTemplate.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Message Content</p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedTemplate.content}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Variables</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Template Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Edit Template' : 'Create New Template'}
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Flash Sale Announcement"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Template['category'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Promotions">Promotions</option>
                    <option value="Alerts">Alerts</option>
                    <option value="Updates">Updates</option>
                    <option value="Welcome">Welcome</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Use {{variable_name}} for dynamic content"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use double curly braces for variables: {`{{customer_name}}, {{order_id}}`}
                  </p>
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
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {isEditing ? 'Update Template' : 'Create Template'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}