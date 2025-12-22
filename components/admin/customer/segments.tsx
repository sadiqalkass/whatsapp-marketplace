"use client"

import React, { useState } from 'react';
import { Users, Plus, Search, Edit2, Trash2, Send, Tag, ShoppingCart, TrendingUp, Filter, X, ChevronRight } from 'lucide-react';

// Mock Data for Segments
const mockSegments = [
  {
    id: 1,
    name: 'VIP Customers',
    description: 'High-value customers with 5+ orders',
    customerCount: 127,
    criteria: {
      minOrders: 5,
      minSpent: 200000,
      tags: ['VIP']
    },
    tags: ['VIP', 'High Spender'],
    purchaseBehavior: {
      avgOrderValue: 85000,
      totalRevenue: 10795000,
      lastPurchase: 'Within 7 days',
      preferredCategories: ['Electronics', 'Fashion']
    },
    color: 'purple'
  },
  {
    id: 2,
    name: 'New Customers',
    description: 'Customers who joined in the last 30 days',
    customerCount: 89,
    criteria: {
      joinedWithin: '30 days',
      maxOrders: 1,
      tags: ['New Customer']
    },
    tags: ['New Customer', 'First Order'],
    purchaseBehavior: {
      avgOrderValue: 32000,
      totalRevenue: 2848000,
      lastPurchase: 'Within 30 days',
      preferredCategories: ['Fashion', 'Home']
    },
    color: 'blue'
  },
  {
    id: 3,
    name: 'At Risk',
    description: 'No purchase in 60+ days',
    customerCount: 45,
    criteria: {
      lastPurchase: '60+ days ago',
      previousOrders: '2+',
      tags: ['Inactive']
    },
    tags: ['Inactive', 'Needs Attention'],
    purchaseBehavior: {
      avgOrderValue: 48000,
      totalRevenue: 2160000,
      lastPurchase: '60+ days ago',
      preferredCategories: ['Electronics', 'Beauty']
    },
    color: 'red'
  },
  {
    id: 4,
    name: 'Repeat Buyers',
    description: 'Customers with 3-4 orders',
    customerCount: 213,
    criteria: {
      minOrders: 3,
      maxOrders: 4,
      tags: ['Active']
    },
    tags: ['Active', 'Loyal'],
    purchaseBehavior: {
      avgOrderValue: 54000,
      totalRevenue: 11502000,
      lastPurchase: 'Within 14 days',
      preferredCategories: ['Fashion', 'Home', 'Beauty']
    },
    color: 'green'
  },
  {
    id: 5,
    name: 'Deal Seekers',
    description: 'Customers who frequently use discount codes',
    customerCount: 156,
    criteria: {
      usedDiscounts: '3+',
      tags: ['Negotiating']
    },
    tags: ['Negotiating', 'Discount User'],
    purchaseBehavior: {
      avgOrderValue: 38000,
      totalRevenue: 5928000,
      lastPurchase: 'Within 21 days',
      preferredCategories: ['Fashion', 'Home']
    },
    color: 'yellow'
  },
  {
    id: 6,
    name: 'High Potential',
    description: 'New customers with high first order value',
    customerCount: 34,
    criteria: {
      firstOrderValue: '50000+',
      joinedWithin: '60 days',
      tags: ['New Customer']
    },
    tags: ['New Customer', 'High Value'],
    purchaseBehavior: {
      avgOrderValue: 78000,
      totalRevenue: 2652000,
      lastPurchase: 'Within 30 days',
      preferredCategories: ['Electronics', 'Fashion']
    },
    color: 'indigo'
  }
];

type Segment = { id: number; name: string; description: string; customerCount: number; criteria: Record<string, any>; tags: string[]; purchaseBehavior: { avgOrderValue: number; totalRevenue: number; lastPurchase: string; preferredCategories: string[] }; color: string };

// TagBadge Component
type TagBadgeProps = { tag: string };
const TagBadge: React.FC<TagBadgeProps> = ({ tag }) => {
  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'vip':
      case 'high spender':
      case 'high value':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'active':
      case 'loyal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'new customer':
      case 'first order':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inactive':
      case 'needs attention':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'negotiating':
      case 'discount user':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getTagColor(tag)}`}>
      <Tag className="w-3 h-3" />
      {tag}
    </span>
  );
};

// SegmentCard Component
type SegmentCardProps = { segment: Segment; onClick: () => void; onEdit: (id: number) => void; onDelete: (id: number) => void; onBroadcast: (id: number) => void };
const SegmentCard: React.FC<SegmentCardProps> = ({ segment, onClick, onEdit, onDelete, onBroadcast }) => {
  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'border-l-purple-500 bg-purple-50',
      blue: 'border-l-blue-500 bg-blue-50',
      red: 'border-l-red-500 bg-red-50',
      green: 'border-l-green-500 bg-green-50',
      yellow: 'border-l-yellow-500 bg-yellow-50',
      indigo: 'border-l-indigo-500 bg-indigo-50'
    };
    return colors[color] || 'border-l-gray-500 bg-gray-50';
  };

  return (
    <div
      className={`bg-white rounded-lg border-2 border-l-4 border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer ${getColorClasses(segment.color)}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{segment.name}</h3>
          <p className="text-sm text-gray-600">{segment.description}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(segment.id);
            }}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            title="Edit Segment"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(segment.id);
            }}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            title="Delete Segment"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-2xl font-bold text-gray-900">{segment.customerCount}</span>
          </div>
          <span className="text-sm text-gray-600">customers</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {segment.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBroadcast(segment.id);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Send className="w-4 h-4" />
          <span className="text-sm font-medium">Send Broadcast</span>
        </button>
        <button
          onClick={onClick}
          className="p-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

// Segment Detail Modal Component
type SegmentDetailModalProps = { segment: Segment | null; onClose: () => void };
const SegmentDetailModal: React.FC<SegmentDetailModalProps> = ({ segment, onClose }) => {
  if (!segment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{segment.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{segment.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Count */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Customers</p>
                <p className="text-4xl font-bold text-gray-900">{segment.customerCount}</p>
              </div>
              <Users className="w-16 h-16 text-blue-600 opacity-20" />
            </div>
          </div>

          {/* Applied Tags */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Applied Tags
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {segment.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </div>

          {/* Criteria */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Segment Criteria
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="space-y-2">
                {Object.entries(segment.criteria).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="font-medium text-gray-900">{Array.isArray(value) ? value.join(', ') : value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Purchase Behavior */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Purchase Behavior Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Avg Order Value</p>
                <p className="text-xl font-bold text-gray-900">₦{segment.purchaseBehavior.avgOrderValue.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                <p className="text-xl font-bold text-green-600">₦{segment.purchaseBehavior.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Last Purchase</p>
                <p className="text-lg font-semibold text-gray-900">{segment.purchaseBehavior.lastPurchase}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Preferred Categories</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {segment.purchaseBehavior.preferredCategories.map((cat) => (
                    <span key={cat} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{cat}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                console.log('Editing segment:', segment.id);
                alert(`Editing segment: ${segment.name}`);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span className="font-medium">Edit Segment</span>
            </button>
            <button
              onClick={() => {
                console.log('Broadcasting to segment:', segment.id);
                alert(`Sending broadcast to ${segment.customerCount} customers in "${segment.name}"`);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span className="font-medium">Send Broadcast</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Segments Page Component
const SegmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredSegments = mockSegments.filter(segment =>
    segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    segment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    segment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (segmentId: number) => {
    console.log('Editing segment:', segmentId);
    alert(`Edit segment ${segmentId}`);
  };

  const handleDelete = (segmentId: number) => {
    console.log('Deleting segment:', segmentId);
    if (confirm('Are you sure you want to delete this segment?')) {
      alert(`Segment ${segmentId} deleted`);
    }
  };

  const handleBroadcast = (segmentId: number) => {
    const segment = mockSegments.find(s => s.id === segmentId);
    console.log('Broadcasting to segment:', segmentId);
    if (segment) {
      alert(`Sending broadcast to ${segment.customerCount} customers`);
    }
  };

  const totalCustomers = mockSegments.reduce((sum, seg) => sum + seg.customerCount, 0);
  const totalRevenue = mockSegments.reduce((sum, seg) => sum + seg.purchaseBehavior.totalRevenue, 0);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Customer Segments</h1>
                <p className="text-gray-600">Group customers for targeting and analysis</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create Segment</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-gray-600" />
              <p className="text-sm text-gray-600">Total Segments</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockSegments.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600">Total Customers</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{totalCustomers}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600">Combined Revenue</p>
            </div>
            <p className="text-2xl font-bold text-green-600">₦{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search segments by name, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Segments Grid */}
        {filteredSegments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSegments.map((segment) => (
              <SegmentCard
                key={segment.id}
                segment={segment}
                onClick={() => setSelectedSegment(segment)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onBroadcast={handleBroadcast}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No segments found matching your search</p>
          </div>
        )}
      </div>

      {/* Segment Detail Modal */}
      {selectedSegment && (
        <SegmentDetailModal
          segment={selectedSegment}
          onClose={() => setSelectedSegment(null)}
        />
      )}

      {/* Create Segment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Segment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segment Name</label>
                <input
                  type="text"
                  placeholder="e.g., Premium Buyers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe this segment..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    console.log('Creating new segment');
                    alert('New segment created!');
                    setShowCreateModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SegmentsPage;