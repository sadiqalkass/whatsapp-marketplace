// 'use client';

// import React, { useState } from 'react';
// import { Plus, Eye, Edit, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
// import { Template, StatusBadgeProps } from '../../../Types/types';

// const StatusBadge = ({ status, type = 'neutral' }: StatusBadgeProps) => {
//   const colors = {
//     success: 'bg-green-100 text-green-800',
//     warning: 'bg-yellow-100 text-yellow-800',
//     error: 'bg-red-100 text-red-800',
//     info: 'bg-blue-100 text-blue-800',
//     neutral: 'bg-gray-100 text-gray-800',
//   };

//   return (
//     <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type]}`}>
//       {status}
//     </span>
//   );
// };

// const mockTemplates: Template[] = [
//   {
//     id: 'TPL-001',
//     name: 'Flash Sale Announcement',
//     category: 'Promotions',
//     approvalStatus: 'Approved',
//     lastUpdated: '2024-12-15',
//     content: 'Hi {{customer_name}}! 🎉 Flash Sale Alert! Get {{discount}}% off on {{product_category}}. Valid until {{expiry_date}}. Shop now: {{shop_link}}',
//     variables: ['customer_name', 'discount', 'product_category', 'expiry_date', 'shop_link'],
//   },
//   {
//     id: 'TPL-002',
//     name: 'Order Confirmation',
//     category: 'Alerts',
//     approvalStatus: 'Approved',
//     lastUpdated: '2024-12-18',
//     content: 'Hello {{customer_name}}, your order #{{order_id}} has been confirmed! Total: {{amount}}. Expected delivery: {{delivery_date}}. Track: {{tracking_link}}',
//     variables: ['customer_name', 'order_id', 'amount', 'delivery_date', 'tracking_link'],
//   },
//   {
//     id: 'TPL-003',
//     name: 'New Product Launch',
//     category: 'Updates',
//     approvalStatus: 'Pending',
//     lastUpdated: '2024-12-20',
//     content: 'Exciting news {{customer_name}}! We just launched {{product_name}}. Be the first to try it! {{product_link}}',
//     variables: ['customer_name', 'product_name', 'product_link'],
//   },
//   {
//     id: 'TPL-004',
//     name: 'Cart Abandonment Reminder',
//     category: 'Alerts',
//     approvalStatus: 'Approved',
//     lastUpdated: '2024-12-10',
//     content: 'Hi {{customer_name}}, you left {{item_count}} items in your cart. Complete your purchase now and get {{discount}}% off! {{cart_link}}',
//     variables: ['customer_name', 'item_count', 'discount', 'cart_link'],
//   },
//   {
//     id: 'TPL-005',
//     name: 'Welcome New Customer',
//     category: 'Welcome',
//     approvalStatus: 'Rejected',
//     lastUpdated: '2024-12-08',
//     content: 'Welcome to {{store_name}}, {{customer_name}}! Here\'s a special {{discount}}% discount on your first order. Use code: {{code}}',
//     variables: ['store_name', 'customer_name', 'discount', 'code'],
//   },
// ];

// export default function TemplatesPage() {
//   const [templates, setTemplates] = useState(mockTemplates);
//   const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     category: 'Promotions' as Template['category'],
//     content: '',
//   });

//   const getStatusType = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
//     if (status === 'Approved') return 'success';
//     if (status === 'Pending') return 'warning';
//     if (status === 'Rejected') return 'error';
//     return 'neutral';
//   };

//   const handlePreview = (template: Template) => {
//     setSelectedTemplate(template);
//     setShowPreview(true);
//   };

//   const handleEdit = (template: Template) => {
//     setFormData({
//       name: template.name,
//       category: template.category,
//       content: template.content,
//     });
//     setSelectedTemplate(template);
//     setIsEditing(true);
//     setShowCreateModal(true);
//   };

//   const handleSubmitForApproval = (template: Template) => {
//     alert(`Template "${template.name}" submitted for WhatsApp approval!`);
//   };

//   const handleSaveTemplate = () => {
//     if (!formData.name || !formData.content) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     const variables = formData.content.match(/\{\{(.*?)\}\}/g)?.map(v => v.replace(/\{\{|\}\}/g, '')) || [];

//     if (isEditing && selectedTemplate) {
//       setTemplates(templates.map(t => 
//         t.id === selectedTemplate.id 
//           ? { ...t, ...formData, variables, lastUpdated: new Date().toISOString().split('T')[0] }
//           : t
//       ));
//       alert('Template updated successfully!');
//     } else {
//       const newTemplate: Template = {
//         id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
//         ...formData,
//         approvalStatus: 'Pending',
//         lastUpdated: new Date().toISOString().split('T')[0],
//         variables,
//       };
//       setTemplates([newTemplate, ...templates]);
//       alert('Template created successfully!');
//     }

//     setShowCreateModal(false);
//     setIsEditing(false);
//     setSelectedTemplate(null);
//     setFormData({ name: '', category: 'Promotions', content: '' });
//   };

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-7xl mx-auto p-8">
//         {/* Header */}
//         <div className="mb-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Message Templates</h1>
//             <p className="text-gray-600 mt-2">Manage WhatsApp-approved message templates</p>
//           </div>
//           <button
//             onClick={() => {
//               setIsEditing(false);
//               setFormData({ name: '', category: 'Promotions', content: '' });
//               setShowCreateModal(true);
//             }}
//             className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
//           >
//             <Plus className="w-5 h-5" />
//             Create Template
//           </button>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Templates</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">{templates.length}</p>
//               </div>
//               <div className="bg-blue-50 p-3 rounded-full">
//                 <FileText className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Approved</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">
//                   {templates.filter(t => t.approvalStatus === 'Approved').length}
//                 </p>
//               </div>
//               <div className="bg-green-50 p-3 rounded-full">
//                 <CheckCircle className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Pending</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">
//                   {templates.filter(t => t.approvalStatus === 'Pending').length}
//                 </p>
//               </div>
//               <div className="bg-yellow-50 p-3 rounded-full">
//                 <Clock className="w-6 h-6 text-yellow-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Rejected</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">
//                   {templates.filter(t => t.approvalStatus === 'Rejected').length}
//                 </p>
//               </div>
//               <div className="bg-red-50 p-3 rounded-full">
//                 <XCircle className="w-6 h-6 text-red-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Templates Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-900">All Templates</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Template Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Category
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Approval Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Last Updated
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Variables
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {templates.map((template) => (
//                   <tr key={template.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {template.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {template.category}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <StatusBadge 
//                         status={template.approvalStatus} 
//                         type={getStatusType(template.approvalStatus)}
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {template.lastUpdated}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       <div className="flex flex-wrap gap-1">
//                         {template.variables.slice(0, 2).map((variable, idx) => (
//                           <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded">
//                             {variable}
//                           </span>
//                         ))}
//                         {template.variables.length > 2 && (
//                           <span className="px-2 py-1 bg-gray-100 text-xs rounded">
//                             +{template.variables.length - 2}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handlePreview(template)}
//                           className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleEdit(template)}
//                           className="text-green-600 hover:text-green-800 flex items-center gap-1"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         {template.approvalStatus !== 'Pending' && (
//                           <button
//                             onClick={() => handleSubmitForApproval(template)}
//                             className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded hover:bg-yellow-200"
//                           >
//                             Submit
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Preview Modal */}
//         {showPreview && selectedTemplate && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
//               <div className="flex justify-between items-start mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900">Template Preview</h2>
//                 <button
//                   onClick={() => setShowPreview(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Template Name</p>
//                   <p className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Category</p>
//                   <p className="text-gray-900">{selectedTemplate.category}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-2">Message Content</p>
//                   <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                     <p className="text-gray-900 whitespace-pre-wrap">{selectedTemplate.content}</p>
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-2">Variables</p>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedTemplate.variables.map((variable, idx) => (
//                       <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
//                         {variable}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6 flex justify-end">
//                 <button
//                   onClick={() => setShowPreview(false)}
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Create/Edit Template Modal */}
//         {showCreateModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-start mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   {isEditing ? 'Edit Template' : 'Create New Template'}
//                 </h2>
//                 <button
//                   onClick={() => setShowCreateModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Template Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     placeholder="e.g., Flash Sale Announcement"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Category *
//                   </label>
//                   <select
//                     value={formData.category}
//                     onChange={(e) => setFormData({ ...formData, category: e.target.value as Template['category'] })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="Promotions">Promotions</option>
//                     <option value="Alerts">Alerts</option>
//                     <option value="Updates">Updates</option>
//                     <option value="Welcome">Welcome</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Message Content *
//                   </label>
//                   <textarea
//                     value={formData.content}
//                     onChange={(e) => setFormData({ ...formData, content: e.target.value })}
//                     placeholder="Use {{variable_name}} for dynamic content"
//                     rows={6}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     Use double curly braces for variables: {`{{customer_name}}, {{order_id}}`}
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-6 flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowCreateModal(false)}
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveTemplate}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   {isEditing ? 'Update Template' : 'Create Template'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, CheckCircle, Clock, XCircle, FileText, RefreshCw, Download, Upload } from 'lucide-react';
import { Template, StatusBadgeProps } from '../../../Types/types';
import broadcastService, { TemplateFilters } from '../../../services/broadcast.service';
import { CreateTemplateDTO, SubmitTemplateDTO } from '../../../Types/broadcast.types';
import toast from 'react-hot-toast';

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

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CreateTemplateDTO>({
    name: '',
    category: 'PROMOTIONS',
    body: '',
    description: '',
    languageCode: 'en_US',
  });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, [pagination.page, filterStatus, filterCategory, search]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const filters: TemplateFilters = {
        page: pagination.page,
        limit: pagination.limit,
        search,
        approvalStatus: filterStatus,
        category: filterCategory,
      };
      
      const response = await broadcastService.getTemplates(filters);
      
      if (response.success) {
        setTemplates(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await broadcastService.getTemplateCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const getStatusType = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
      'APPROVED': 'success',
      'PENDING': 'warning',
      'REJECTED': 'error',
      'DISABLED': 'error',
      'DRAFT': 'neutral',
    };
    return statusMap[status] || 'neutral';
  };

  const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'APPROVED': 'Approved',
      'PENDING': 'Pending',
      'REJECTED': 'Rejected',
      'DISABLED': 'Disabled',
      'DRAFT': 'Draft',
    };
    return statusMap[status] || status;
  };

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleEdit = (template: Template) => {
    setFormData({
      name: template.name,
      category: template.category,
      body: template.content,
      description: template.description || '',
      header: template.header,
      footer: template.footer,
      variables: template.variables,
      languageCode: template.languageCode || 'en_US',
      sampleData: template.sampleData,
    });
    setSelectedTemplate(template);
    setIsEditing(true);
    setShowCreateModal(true);
  };

  const handleSubmitForApproval = async (templateId: string) => {
    if (confirm('Are you sure you want to submit this template for WhatsApp approval?')) {
      try {
        const data: SubmitTemplateDTO = {
          notes: '',
          reviewerEmails: [],
        };
        const response = await broadcastService.submitTemplateForApproval(templateId, data);
        
        if (response.success) {
          toast.success('Template submitted for approval successfully!');
          fetchTemplates();
        }
      } catch (error: any) {
        toast.error(`Failed to submit template: ${error.message}`);
      }
    }
  };

  const handleSaveTemplate = async () => {
    try {
      if (!formData.name || !formData.body) {
        toast.error('Please fill in all required fields');
        return;
      }

      let response;
      if (isEditing && selectedTemplate) {
        response = await broadcastService.updateTemplate(selectedTemplate.id, formData);
      } else {
        response = await broadcastService.createTemplate(formData);
      }

      if (response.success) {
        toast.success(isEditing ? 'Template updated successfully!' : 'Template created successfully!');
        setShowCreateModal(false);
        setIsEditing(false);
        setSelectedTemplate(null);
        setFormData({
          name: '',
          category: 'PROMOTIONS',
          body: '',
          description: '',
          languageCode: 'en_US',
        });
        fetchTemplates();
      }
    } catch (error: any) {
      toast.error(`Failed to save template: ${error.message}`);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        const response = await broadcastService.deleteTemplate(templateId);
        if (response.success) {
          toast.success('Template deleted successfully!');
          fetchTemplates();
        }
      } catch (error: any) {
        toast.error(`Failed to delete template: ${error.message}`);
      }
    }
  };

  const handleExportTemplates = async () => {
    try {
      const selectedIds = templates.map(t => t.id);
      const response = await broadcastService.exportTemplates(selectedIds);
      
      if (response.success) {
        // Create and trigger download
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `templates-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast.error('Failed to export templates');
    }
  };

  const handleImportTemplates = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await broadcastService.importTemplates(file);
      
      if (response.success) {
        toast.success(`Import completed: ${response.data.succeeded} succeeded, ${response.data.failed} failed`);
        fetchTemplates();
      }
    } catch (error) {
      toast.error('Failed to import templates');
    } finally {
      // Reset file input
      event.target.value = '';
    }
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
          <div className="flex gap-3">
            <button
              onClick={handleExportTemplates}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <label className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".csv,.json"
                className="hidden"
                onChange={handleImportTemplates}
              />
            </label>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: '',
                  category: 'PROMOTIONS',
                  body: '',
                  description: '',
                  languageCode: 'en_US',
                });
                setShowCreateModal(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Template
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchTemplates}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Templates</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{pagination.total}</p>
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
                <p className="text-sm font-medium text-gray-600">Draft/Rejected</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {templates.filter(t => t.approvalStatus === 'Draft' || t.approvalStatus === 'Rejected').length}
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
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">All Templates</h2>
            {loading && (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500 mb-4">Create your first template to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Template
              </button>
            </div>
          ) : (
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {templates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{template.name}</div>
                        {template.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">{template.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {template.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          status={formatStatus(template.approvalStatus)} 
                          type={getStatusType(template.approvalStatus)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {template.languageCode || 'en_US'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {template.lastUpdated || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePreview(template)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(template)}
                            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            ✕
                          </button>
                          {template.approvalStatus === 'Draft' && (
                            <button
                              onClick={() => handleSubmitForApproval(template.id)}
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
          )}
        </div>

        {/* Pagination */}
        {templates.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing {templates.length} of {pagination.total} templates
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Category</p>
                    <p className="text-gray-900">{selectedTemplate.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="text-gray-900">
                      <StatusBadge 
                        status={formatStatus(selectedTemplate.approvalStatus)} 
                        type={getStatusType(selectedTemplate.approvalStatus)}
                      />
                    </p>
                  </div>
                </div>

                {selectedTemplate.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Description</p>
                    <p className="text-gray-900">{selectedTemplate.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Message Content</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    {selectedTemplate.header && (
                      <div className="mb-2 text-sm text-gray-700">
                        <strong>Header:</strong> {selectedTemplate.header}
                      </div>
                    )}
                    <div className="mb-2">
                      <strong>Body:</strong>
                      <p className="text-gray-900 whitespace-pre-wrap mt-1">{selectedTemplate.content}</p>
                    </div>
                    {selectedTemplate.footer && (
                      <div className="mt-2 text-sm text-gray-700">
                        <strong>Footer:</strong> {selectedTemplate.footer}
                      </div>
                    )}
                  </div>
                </div>

                {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
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
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
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
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this template"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PROMOTIONS">Promotions</option>
                    <option value="ALERTS">Alerts</option>
                    <option value="UPDATES">Updates</option>
                    <option value="WELCOME">Welcome</option>
                    <option value="UTILITY">Utility</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="AUTHENTICATION">Authentication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language *
                  </label>
                  <select
                    value={formData.languageCode}
                    onChange={(e) => setFormData({ ...formData, languageCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en_US">English (US)</option>
                    <option value="en_GB">English (UK)</option>
                    <option value="fr_FR">French</option>
                    <option value="es_ES">Spanish</option>
                    <option value="de_DE">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.header || ''}
                    onChange={(e) => setFormData({ ...formData, header: e.target.value })}
                    placeholder="Template header text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Body *
                  </label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Use {{variable_name}} for dynamic content"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use double curly braces for variables: {`{{customer_name}}, {{order_id}}`}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.footer || ''}
                    onChange={(e) => setFormData({ ...formData, footer: e.target.value })}
                    placeholder="Template footer text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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