'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Edit2, Trash2, Send, Tag, 
  ShoppingCart, TrendingUp, Filter, X, ChevronRight,
  Calendar, DollarSign, Package, Clock, Percent,
  Hash, Award, AlertCircle, RefreshCw, Download, Upload
} from 'lucide-react';
import broadcastService from '../../../services/broadcast.service';
import { Segment, CreateSegmentDTO, UpdateSegmentDTO } from '../../../Types/broadcast.types';
import toast from 'react-hot-toast';

// TagBadge Component
type TagBadgeProps = { 
  tag: string; 
  onRemove?: () => void;
  removable?: boolean;
};
const TagBadge: React.FC<TagBadgeProps> = ({ tag, onRemove, removable = false }) => {
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
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:opacity-70"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

// Create/Edit Segment Modal Component
type CreateSegmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  segmentToEdit?: Segment | null;
  onSave: (segment: CreateSegmentDTO | UpdateSegmentDTO, isEditing: boolean) => Promise<void>;
  onEstimateSize: (criteria: any) => Promise<number>;
};

const CreateSegmentModal: React.FC<CreateSegmentModalProps> = ({
  isOpen,
  onClose,
  segmentToEdit,
  onSave,
  onEstimateSize
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    color: string;
    criteria: Record<string, any>;
    tags: string[];
  }>({
    name: '',
    description: '',
    color: 'purple',
    criteria: {},
    tags: [],
  });

  const [newTag, setNewTag] = useState('');
  const [activeCriteria, setActiveCriteria] = useState<string[]>([]);
  const [selectedCriterion, setSelectedCriterion] = useState('');
  const [criterionValue, setCriterionValue] = useState('');
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Get options from service
  const colorOptions = broadcastService.getSegmentColors();
  const criteriaOptions = broadcastService.getCriteriaOptions();
  const tagOptions = broadcastService.getDefaultTagOptions();

  // Initialize form with segment data if editing
  useEffect(() => {
    if (segmentToEdit) {
      setFormData({
        name: segmentToEdit.name,
        description: segmentToEdit.description || '',
        color: segmentToEdit.color,
        criteria: segmentToEdit.criteria,
        tags: segmentToEdit.tags,
      });
      setActiveCriteria(Object.keys(segmentToEdit.criteria));
      setEstimatedSize(segmentToEdit.customerCount);
    } else {
      // Reset form for new segment
      setFormData({
        name: '',
        description: '',
        color: 'purple',
        criteria: {},
        tags: [],
      });
      setActiveCriteria([]);
      setEstimatedSize(null);
    }
  }, [segmentToEdit]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCriteriaChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [key]: value
      }
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddCriterion = () => {
    if (selectedCriterion && criterionValue) {
      handleCriteriaChange(selectedCriterion, criterionValue);
      if (!activeCriteria.includes(selectedCriterion)) {
        setActiveCriteria(prev => [...prev, selectedCriterion]);
      }
      setSelectedCriterion('');
      setCriterionValue('');
    }
  };

  const handleRemoveCriterion = (criterionToRemove: string) => {
    const { [criterionToRemove]: _, ...remainingCriteria } = formData.criteria;
    setFormData(prev => ({
      ...prev,
      criteria: remainingCriteria
    }));
    setActiveCriteria(prev => prev.filter(c => c !== criterionToRemove));
  };

  const handleEstimateSize = async () => {
    if (Object.keys(formData.criteria).length === 0) {
      toast.error('Please add at least one criteria before estimating');
      return;
    }

    try {
      setIsEstimating(true);
      const count = await onEstimateSize(formData.criteria);
      setEstimatedSize(count);
    } catch (error) {
      console.error('Error estimating segment size:', error);
      toast.error('Failed to estimate segment size');
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      toast.error('Please enter a segment name');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    if (Object.keys(formData.criteria).length === 0) {
      toast.error('Please add at least one criteria');
      return;
    }

    try {
      setSaving(true);
      await onSave(formData, !!segmentToEdit);
    } catch (error) {
      console.error('Error saving segment:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {segmentToEdit ? 'Edit Segment' : 'Create New Segment'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {segmentToEdit ? 'Update your segment details' : 'Define criteria and settings for your customer segment'}
            </p>
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
          {/* Basic Information */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Segment Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., VIP Customers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Segment Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleInputChange('color', color.value)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
                        formData.color === color.value
                          ? `${color.border} border-2 bg-white`
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${color.bg}`}></div>
                      <span className="text-sm">{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe this segment..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Segment Criteria */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">Segment Criteria *</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {Object.keys(formData.criteria).length} criteria applied
                </span>
                {estimatedSize !== null && (
                  <span className="text-sm font-medium text-blue-600">
                    Estimated: {estimatedSize} customers
                  </span>
                )}
              </div>
            </div>
            
            {/* Add Criteria */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Criteria Type
                  </label>
                  <select
                    value={selectedCriterion}
                    onChange={(e) => setSelectedCriterion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a criteria</option>
                    {criteriaOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={criterionValue}
                    onChange={(e) => setCriterionValue(e.target.value)}
                    placeholder={
                      criteriaOptions.find(opt => opt.id === selectedCriterion)?.placeholder || 
                      'Enter value...'
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddCriterion}
                  disabled={!selectedCriterion || !criterionValue}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Add Criteria
                </button>
                <button
                  onClick={handleEstimateSize}
                  disabled={Object.keys(formData.criteria).length === 0 || isEstimating}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isEstimating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Estimating...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      Estimate Size
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Applied Criteria */}
            {activeCriteria.length > 0 ? (
              <div className="space-y-2">
                {activeCriteria.map((criterion) => {
                  const option = criteriaOptions.find(opt => opt.id === criterion);
                  return (
                    <div key={criterion} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        {option && (
                          <>
                            <div>
                              <span className="font-medium text-gray-900">{option.label}</span>
                              <span className="text-sm text-gray-600 ml-2">
                                = {formData.criteria[criterion]}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveCriterion(criterion)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
                <Filter className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No criteria added yet</p>
                <p className="text-sm text-gray-400">Add criteria to define your segment</p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">Tags</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Tags
              </label>
              <div className="flex gap-2">
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select or type a tag</option>
                  {tagOptions.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Or type custom tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Applied Tags */}
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  onRemove={() => handleRemoveTag(tag)}
                  removable
                />
              ))}
              {formData.tags.length === 0 && (
                <p className="text-sm text-gray-500 italic">No tags added yet</p>
              )}
            </div>
          </div>

          {/* Preview (Optional) */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Segment Preview</span>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Name:</strong> {formData.name || 'Not set'}</p>
              <p><strong>Criteria:</strong> {Object.keys(formData.criteria).length} rules applied</p>
              <p><strong>Tags:</strong> {formData.tags.length} tags added</p>
              {estimatedSize !== null && (
                <p><strong>Estimated Size:</strong> {estimatedSize} customers</p>
              )}
              {formData.description && (
                <p><strong>Description:</strong> {formData.description}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              <span className="font-medium">Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="font-medium">
                    {segmentToEdit ? 'Updating...' : 'Creating...'}
                  </span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">
                    {segmentToEdit ? 'Update Segment' : 'Create Segment'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// SegmentCard Component
type SegmentCardProps = { 
  segment: Segment; 
  onClick: () => void; 
  onEdit: (segment: Segment) => void; 
  onDelete: (id: string) => void; 
  onBroadcast: (id: string) => void;
  onDuplicate: (id: string) => void;
};

const SegmentCard: React.FC<SegmentCardProps> = ({ 
  segment, 
  onClick, 
  onEdit, 
  onDelete, 
  onBroadcast,
  onDuplicate 
}) => {
  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
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
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(segment.id);
            }}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            title="Duplicate Segment"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(segment);
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
            <span className="text-2xl font-bold text-gray-900">{segment.customerCount.toLocaleString()}</span>
          </div>
          <span className="text-sm text-gray-600">customers</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {segment.tags.slice(0, 3).map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
        {segment.tags.length > 3 && (
          <span className="text-xs text-gray-500">+{segment.tags.length - 3} more</span>
        )}
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
type SegmentDetailModalProps = { 
  segment: Segment | null; 
  onClose: () => void; 
  onEdit: (segment: Segment) => void;
  onBroadcast: (segment: Segment) => void;
};

const SegmentDetailModal: React.FC<SegmentDetailModalProps> = ({ 
  segment, 
  onClose, 
  onEdit,
  onBroadcast 
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (segment) {
      fetchSegmentStats();
    }
  }, [segment]);

  const fetchSegmentStats = async () => {
    if (!segment) return;
    
    try {
      setLoading(true);
      const response = await broadcastService.getSegmentStats(segment.id);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching segment stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!segment) return null;

  const colorClasses = broadcastService.formatSegmentColor(segment.color);

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
          <div className={`rounded-lg p-6 border ${colorClasses.border} ${colorClasses.bg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Customers</p>
                <p className="text-4xl font-bold text-gray-900">{segment.customerCount.toLocaleString()}</p>
              </div>
              <Users className="w-16 h-16 text-gray-600 opacity-20" />
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

          {/* Segment Stats */}
          {stats && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Segment Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Used in Broadcasts</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalBroadcasts || 0}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-xl font-bold text-green-600">
                    ₦{(segment.purchaseBehavior?.totalRevenue || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onEdit(segment);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span className="font-medium">Edit Segment</span>
            </button>
            <button
              onClick={() => {
                onBroadcast(segment);
                onClose();
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
  const [segmentToEdit, setSegmentToEdit] = useState<Segment | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetchSegments();
    fetchAvailableTags();
  }, [searchTerm, pagination.page, selectedTags]);

  const fetchSegments = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        page: pagination.page,
        limit: pagination.limit,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      };
      
      const response = await broadcastService.getSegments(filters);
      
      if (response.success) {
        setSegments(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch segments:', error);
      toast.error('Failed to load segments');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTags = async () => {
    try {
      const response = await broadcastService.getSegmentTags();
      if (response.success) {
        setAvailableTags(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const handleEditSegment = (segment: Segment) => {
    setSegmentToEdit(segment);
    setShowCreateModal(true);
  };

  const handleDeleteSegment = async (segmentId: string) => {
    if (confirm('Are you sure you want to delete this segment?')) {
      try {
        const response = await broadcastService.deleteSegment(segmentId);
        
        if (response.success) {
          toast.success('Segment deleted successfully!');
          fetchSegments();
        }
      } catch (error: any) {
        toast.error(`Failed to delete segment: ${error.message}`);
      }
    }
  };

  const handleDuplicateSegment = async (segmentId: string) => {
    const newName = prompt('Enter new name for duplicated segment:');
    if (newName) {
      try {
        const response = await broadcastService.duplicateSegment(segmentId, newName);
        
        if (response.success) {
          toast.success('Segment duplicated successfully!');
          fetchSegments();
        }
      } catch (error: any) {
        toast.error(`Failed to duplicate segment: ${error.message}`);
      }
    }
  };

  const handleBroadcast = async (segmentId: string) => {
    const segment = segments.find(s => s.id === segmentId);
    if (segment) {
      // Navigate to broadcast creation with this segment pre-selected
      window.location.href = `/admin/broadcasts?segmentId=${segmentId}`;
    }
  };

  const handleSaveSegment = async (segmentData: CreateSegmentDTO | UpdateSegmentDTO, isEditing: boolean) => {
    try {
      let response;
      
      if (isEditing && segmentToEdit) {
        response = await broadcastService.updateSegment(segmentToEdit.id, segmentData as UpdateSegmentDTO);
      } else {
        response = await broadcastService.createSegment(segmentData as CreateSegmentDTO);
      }

      if (response.success) {
        toast.success(isEditing ? 'Segment updated successfully!' : 'Segment created successfully!');
        setShowCreateModal(false);
        setSegmentToEdit(null);
        fetchSegments();
      }
    } catch (error: any) {
      toast.error(`Failed to save segment: ${error.message}`);
      throw error;
    }
  };

  const handleEstimateSegmentSize = async (criteria: any): Promise<number> => {
    try {
      const response = await broadcastService.estimateSegmentSize(criteria);
      if (response.success) {
        return response.data.count;
      }
      throw new Error('Failed to estimate segment size');
    } catch (error: any) {
      toast.error(`Failed to estimate segment size: ${error.message}`);
      throw error;
    }
  };

  const handleExportSegments = async () => {
    try {
      const response = await broadcastService.exportSegmentCustomers(selectedSegment?.id || '', 'csv');
      
      if (response.success) {
        // Create and trigger download
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `segment-${selectedSegment?.name || 'export'}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast.error('Failed to export segment');
    }
  };

  const handleImportSegments = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await broadcastService.importSegmentsFromCsv(file);
      
      if (response.success) {
        toast.success(`Import completed: ${response.data.imported} imported, ${response.data.failed} failed`);
        fetchSegments();
      }
    } catch (error) {
      toast.error('Failed to import segments');
    } finally {
      // Reset file input
      event.target.value = '';
    }
  };

  const totalCustomers = segments.reduce((sum, seg) => sum + seg.customerCount, 0);
  const totalRevenue = segments.reduce((sum, seg) => sum + (seg.purchaseBehavior?.totalRevenue || 0), 0);

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
            <div className="flex gap-3">
              {selectedSegment && (
                <button
                  onClick={handleExportSegments}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Export</span>
                </button>
              )}
              <label className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <Upload className="w-5 h-5" />
                <span className="font-medium">Import</span>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleImportSegments}
                />
              </label>
              <button
                onClick={() => {
                  setSegmentToEdit(null);
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Create Segment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search segments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Tags</label>
            <select
              value={selectedTags[0] || ''}
              onChange={(e) => setSelectedTags(e.target.value ? [e.target.value] : [])}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchSegments}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTags([]);
              }}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
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
            <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600">Total Customers</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{totalCustomers.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600">Combined Revenue</p>
            </div>
            <p className="text-2xl font-bold text-green-600">₦{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-500">Loading segments...</p>
          </div>
        ) : segments.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No segments found</p>
            <p className="text-sm text-gray-400 mb-4">Create your first segment to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Segment
            </button>
          </div>
        ) : (
          <>
            {/* Segments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {segments.map((segment) => (
                <SegmentCard
                  key={segment.id}
                  segment={segment}
                  onClick={() => setSelectedSegment(segment)}
                  onEdit={handleEditSegment}
                  onDelete={handleDeleteSegment}
                  onBroadcast={handleBroadcast}
                  onDuplicate={handleDuplicateSegment}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  Showing {segments.length} of {pagination.total} segments
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= pagination.pages}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Segment Detail Modal */}
      {selectedSegment && (
        <SegmentDetailModal
          segment={selectedSegment}
          onClose={() => setSelectedSegment(null)}
          onEdit={handleEditSegment}
          onBroadcast={() => handleBroadcast(selectedSegment.id)}
        />
      )}

      {/* Create/Edit Segment Modal */}
      <CreateSegmentModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSegmentToEdit(null);
        }}
        segmentToEdit={segmentToEdit}
        onSave={handleSaveSegment}
        onEstimateSize={handleEstimateSegmentSize}
      />
    </div>
  );
};

export default SegmentsPage;