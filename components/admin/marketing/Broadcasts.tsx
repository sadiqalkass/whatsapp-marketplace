// 'use client';

// import React, { useState } from 'react';
// import { Send, Plus, Users, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
// import { Broadcast, StatusBadgeProps } from '@/Types/types';
// import {toast} from 'react-hot-toast';

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

// const mockBroadcasts: Broadcast[] = [
//   {
//     id: 'BC-001',
//     name: 'Weekend Flash Sale',
//     targetSegment: 'Active Customers',
//     messageType: 'Promotional',
//     status: 'Sent',
//     sentDate: '2024-12-20',
//     recipientCount: 1250,
//     deliveryRate: 98,
//   },
//   {
//     id: 'BC-002',
//     name: 'New Product Launch',
//     targetSegment: 'VIP Customers',
//     messageType: 'Update',
//     status: 'Scheduled',
//     sentDate: '2024-12-22',
//     recipientCount: 450,
//   },
//   {
//     id: 'BC-003',
//     name: 'Cart Abandonment Reminder',
//     targetSegment: 'Abandoned Carts',
//     messageType: 'Reminder',
//     status: 'Draft',
//     sentDate: '-',
//     recipientCount: 320,
//   },
//   {
//     id: 'BC-004',
//     name: 'Holiday Special Offer',
//     targetSegment: 'All Customers',
//     messageType: 'Promotional',
//     status: 'Sent',
//     sentDate: '2024-12-18',
//     recipientCount: 3200,
//     deliveryRate: 96,
//   },
// ];

// const customerSegments = [
//   { id: 'active', name: 'Active Customers', count: 1250 },
//   { id: 'vip', name: 'VIP Customers', count: 450 },
//   { id: 'abandoned', name: 'Abandoned Carts', count: 320 },
//   { id: 'all', name: 'All Customers', count: 3200 },
//   { id: 'new', name: 'New Customers', count: 580 },
// ];

// const messageTemplates = [
//   { id: 'promo-1', name: 'Flash Sale Template', category: 'Promotional' },
//   { id: 'update-1', name: 'Product Launch Template', category: 'Update' },
//   { id: 'reminder-1', name: 'Cart Reminder Template', category: 'Reminder' },
//   { id: 'welcome-1', name: 'Welcome Message', category: 'Welcome' },
// ];

// export default function BroadcastsPage() {
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [broadcasts, setBroadcasts] = useState(mockBroadcasts);
//   const [formData, setFormData] = useState({
//     name: '',
//     segment: '',
//     template: '',
//     scheduleType: 'now',
//     scheduleDate: '',
//     scheduleTime: '',
//   });

//   const getStatusType = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
//     if (status === 'Sent') return 'success';
//     if (status === 'Scheduled') return 'info';
//     if (status === 'Draft') return 'neutral';
//     return 'neutral';
//   };

//   const handleCreateBroadcast = () => {
//     const selectedSegment = customerSegments.find(s => s.id === formData.segment);
//     const selectedTemplate = messageTemplates.find(t => t.id === formData.template);
    
//     if (!formData.name || !selectedSegment || !selectedTemplate) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     const newBroadcast: Broadcast = {
//       id: `BC-${String(broadcasts.length + 1).padStart(3, '0')}`,
//       name: formData.name,
//       targetSegment: selectedSegment.name,
//       messageType: selectedTemplate.category,
//       status: formData.scheduleType === 'now' ? 'Sent' : 'Scheduled',
//       sentDate: formData.scheduleType === 'now' ? new Date().toISOString().split('T')[0] : formData.scheduleDate,
//       recipientCount: selectedSegment.count,
//       deliveryRate: formData.scheduleType === 'now' ? 100 : undefined,
//     };

//     setBroadcasts([newBroadcast, ...broadcasts]);
//     setShowCreateModal(false);
//     setFormData({
//       name: '',
//       segment: '',
//       template: '',
//       scheduleType: 'now',
//       scheduleDate: '',
//       scheduleTime: '',
//     });
//     toast.success(`Broadcast ${formData.scheduleType === 'now' ? 'sent' : 'scheduled'} successfully!`);
//   };

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-7xl mx-auto p-8">
//         {/* Header */}
//         <div className="mb-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Broadcast Campaigns</h1>
//             <p className="text-gray-600 mt-2">Send targeted WhatsApp messages to customer segments</p>
//           </div>
//           <button
//             onClick={() => setShowCreateModal(true)}
//             className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
//           >
//             <Plus className="w-5 h-5" />
//             Create Broadcast
//           </button>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Broadcasts</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">{broadcasts.length}</p>
//               </div>
//               <div className="bg-blue-50 p-3 rounded-full">
//                 <MessageSquare className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Sent</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">
//                   {broadcasts.filter(b => b.status === 'Sent').length}
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
//                 <p className="text-sm font-medium text-gray-600">Scheduled</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">
//                   {broadcasts.filter(b => b.status === 'Scheduled').length}
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
//                 <p className="text-sm font-medium text-gray-600">Drafts</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">
//                   {broadcasts.filter(b => b.status === 'Draft').length}
//                 </p>
//               </div>
//               <div className="bg-gray-50 p-3 rounded-full">
//                 <AlertCircle className="w-6 h-6 text-gray-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Broadcasts Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-900">Recent Broadcasts</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Broadcast Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Target Segment
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Message Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Recipients
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Sent Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Delivery
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {broadcasts.map((broadcast) => (
//                   <tr key={broadcast.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {broadcast.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       <div className="flex items-center gap-2">
//                         <Users className="w-4 h-4 text-gray-400" />
//                         {broadcast.targetSegment}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {broadcast.messageType}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {broadcast.recipientCount.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <StatusBadge status={broadcast.status} type={getStatusType(broadcast.status)} />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {broadcast.sentDate}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       {broadcast.deliveryRate ? (
//                         <div className="flex items-center gap-2">
//                           <div className="w-16 bg-gray-200 rounded-full h-2">
//                             <div
//                               className="bg-green-600 h-2 rounded-full"
//                               style={{ width: `${broadcast.deliveryRate}%` }}
//                             />
//                           </div>
//                           <span className="text-gray-600 text-xs">{broadcast.deliveryRate}%</span>
//                         </div>
//                       ) : (
//                         <span className="text-gray-400 text-xs">-</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Create Broadcast Modal */}
//         {showCreateModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-start mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900">Create New Broadcast</h2>
//                 <button
//                   onClick={() => setShowCreateModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 {/* Broadcast Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Broadcast Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     placeholder="e.g., Weekend Flash Sale"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 {/* Customer Segment */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Select Customer Segment *
//                   </label>
//                   <select
//                     value={formData.segment}
//                     onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Choose a segment</option>
//                     {customerSegments.map((segment) => (
//                       <option key={segment.id} value={segment.id}>
//                         {segment.name} ({segment.count.toLocaleString()} customers)
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Message Template */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Choose Message Template *
//                   </label>
//                   <select
//                     value={formData.template}
//                     onChange={(e) => setFormData({ ...formData, template: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select a template</option>
//                     {messageTemplates.map((template) => (
//                       <option key={template.id} value={template.id}>
//                         {template.name} - {template.category}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Schedule Options */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Schedule
//                   </label>
//                   <div className="flex gap-4 mb-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         value="now"
//                         checked={formData.scheduleType === 'now'}
//                         onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value })}
//                         className="mr-2"
//                       />
//                       Send Now
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         value="later"
//                         checked={formData.scheduleType === 'later'}
//                         onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value })}
//                         className="mr-2"
//                       />
//                       Schedule for Later
//                     </label>
//                   </div>

//                   {formData.scheduleType === 'later' && (
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
//                         <input
//                           type="date"
//                           value={formData.scheduleDate}
//                           onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
//                         <input
//                           type="time"
//                           value={formData.scheduleTime}
//                           onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                     </div>
//                   )}
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
//                   onClick={handleCreateBroadcast}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
//                 >
//                   <Send className="w-4 h-4" />
//                   {formData.scheduleType === 'now' ? 'Send Now' : 'Schedule Broadcast'}
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
import { 
  Send, Plus, Users, MessageSquare, Clock, CheckCircle, AlertCircle, 
  Eye, Edit, XCircle, Calendar, Filter, RefreshCw, BarChart 
} from 'lucide-react';
import { Broadcast, StatusBadgeProps } from '@/Types/types';
import broadcastService, { BroadcastFilters } from '@/services/broadcast.service';
import { CreateBroadcastDTO } from '@/Types/broadcast.types';
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

export default function BroadcastsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);
  const [statsData, setStatsData] = useState<any>(null);
  
  const [formData, setFormData] = useState<CreateBroadcastDTO>({
    name: '',
    description: '',
    templateId: '',
    segmentId: '',
    scheduledFor: undefined,
    immediate: false,
  });

  const [filters, setFilters] = useState<BroadcastFilters>({
    page: 1,
    limit: 20,
    search: '',
    status: '',
    approvalStatus: '',
  });

  const [segments, setSegments] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchBroadcasts();
    fetchSegments();
    fetchTemplates();
  }, [filters.page, filters.status, filters.approvalStatus, filters.search]);

  const fetchBroadcasts = async () => {
    try {
      setLoading(true);
      const response = await broadcastService.getBroadcasts(filters);
      
      if (response.success) {
        setBroadcasts(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch broadcasts:', error);
      toast.error('Failed to load broadcasts');
    } finally {
      setLoading(false);
    }
  };

  const fetchSegments = async () => {
    try {
      const response = await broadcastService.getSegments();
      if (response.success) {
        setSegments(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch segments:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await broadcastService.getTemplates({ approvalStatus: 'APPROVED' });
      if (response.success) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const getStatusType = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
      'SENT': 'success',
      'SCHEDULED': 'info',
      'DRAFT': 'neutral',
      'PENDING_APPROVAL': 'warning',
      'APPROVED': 'success',
      'REJECTED': 'error',
      'SENDING': 'info',
      'CANCELLED': 'error',
      'FAILED': 'error',
    };
    return statusMap[status] || 'neutral';
  };

  const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'DRAFT': 'Draft',
      'PENDING_APPROVAL': 'Pending Approval',
      'APPROVED': 'Approved',
      'REJECTED': 'Rejected',
      'SCHEDULED': 'Scheduled',
      'SENDING': 'Sending',
      'SENT': 'Sent',
      'CANCELLED': 'Cancelled',
      'FAILED': 'Failed',
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const handleCreateBroadcast = async () => {
    try {
      if (!formData.name || (!formData.segmentId && !formData.customFilter) || !formData.templateId) {
        toast.error('Please fill in all required fields');
        return;
      }

      const response = await broadcastService.createBroadcast(formData);
      
      if (response.success) {
        toast.success('Broadcast created successfully!');
        setShowCreateModal(false);
        setFormData({
          name: '',
          description: '',
          templateId: '',
          segmentId: '',
          scheduledFor: undefined,
          immediate: false,
        });
        fetchBroadcasts();
      }
    } catch (error: any) {
      toast.error(`Failed to create broadcast: ${error.message}`);
    }
  };

  const handleSendBroadcast = async (broadcastId: string) => {
    if (confirm('Are you sure you want to send this broadcast?')) {
      try {
        const response = await broadcastService.sendBroadcast(broadcastId);
        
        if (response.success) {
          toast.success('Broadcast sending initiated!');
          fetchBroadcasts();
        }
      } catch (error: any) {
        toast.error(`Failed to send broadcast: ${error.message}`);
      }
    }
  };

  const handleApproveBroadcast = async (broadcastId: string) => {
    if (confirm('Approve this broadcast for sending?')) {
      try {
        const response = await broadcastService.approveBroadcast(broadcastId, 'Approved');
        
        if (response.success) {
          toast.success('Broadcast approved!');
          fetchBroadcasts();
        }
      } catch (error: any) {
        toast.error(`Failed to approve broadcast: ${error.message}`);
      }
    }
  };

  const handleRejectBroadcast = async (broadcastId: string) => {
    const reason = prompt('Please enter rejection reason:');
    if (reason) {
      try {
        const response = await broadcastService.rejectBroadcast(broadcastId, reason);
        
        if (response.success) {
          toast.success('Broadcast rejected!');
          fetchBroadcasts();
        }
      } catch (error: any) {
        toast.error(`Failed to reject broadcast: ${error.message}`);
      }
    }
  };

  const handleCancelBroadcast = async (broadcastId: string) => {
    if (confirm('Are you sure you want to cancel this broadcast?')) {
      try {
        const response = await broadcastService.cancelBroadcast(broadcastId);
        
        if (response.success) {
          toast.success('Broadcast cancelled!');
          fetchBroadcasts();
        }
      } catch (error: any) {
        toast.error(`Failed to cancel broadcast: ${error.message}`);
      }
    }
  };

  const handleViewStats = async (broadcastId: string) => {
    try {
      const response = await broadcastService.getBroadcastStats(broadcastId);
      
      if (response.success) {
        setStatsData(response.data);
        setShowStatsModal(true);
      }
    } catch (error: any) {
      toast.error(`Failed to load stats: ${error.message}`);
    }
  };

  const handleDuplicateBroadcast = async (broadcastId: string) => {
    const newName = prompt('Enter new name for duplicated broadcast:');
    if (newName) {
      try {
        const response = await broadcastService.duplicateBroadcast(broadcastId, newName);
        
        if (response.success) {
          toast.success('Broadcast duplicated successfully!');
          fetchBroadcasts();
        }
      } catch (error: any) {
        toast.error(`Failed to duplicate broadcast: ${error.message}`);
      }
    }
  };

  const calculateProgress = (broadcast: Broadcast): number => {
    const total = broadcast.totalRecipients || 0;
    const sent = broadcast.successfulSends || 0;
    
    if (total === 0) return 0;
    return Math.min(100, Math.round((sent / total) * 100));
  };

  const getDeliveryRate = (broadcast: Broadcast): number => {
    const total = broadcast.totalRecipients || 0;
    const sent = broadcast.successfulSends || 0;
    
    if (total === 0) return 0;
    return Math.round((sent / total) * 100);
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

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev: any) => ({ ...prev, search: e.target.value }))}
              placeholder="Search broadcasts..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev: any) => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="SENDING">Sending</option>
              <option value="SENT">Sent</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Approval Status</label>
            <select
              value={filters.approvalStatus}
              onChange={(e) => setFilters((prev: any) => ({ ...prev, approvalStatus: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Approval</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchBroadcasts}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({
                  page: 1,
                  limit: 20,
                  search: '',
                  status: '',
                  approvalStatus: '',
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Broadcasts</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{pagination.total}</p>
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
                  {broadcasts.filter(b => b.status === 'SENT').length}
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
                  {broadcasts.filter(b => b.status === 'SCHEDULED').length}
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
                <p className="text-sm font-medium text-gray-600">Pending/Drafts</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {broadcasts.filter(b => b.status === 'DRAFT' || b.status === 'PENDING_APPROVAL').length}
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
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Broadcasts</h2>
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
              <p className="mt-2 text-gray-500">Loading broadcasts...</p>
            </div>
          ) : broadcasts.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No broadcasts found</h3>
              <p className="text-gray-500 mb-4">Create your first broadcast to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Broadcast
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Broadcast Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {broadcasts.map((broadcast) => (
                    <tr key={broadcast.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{broadcast.name}</div>
                        {broadcast.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">{broadcast.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          status={formatStatus(broadcast.status)} 
                          type={getStatusType(broadcast.status)}
                        />
                        {broadcast.approvalStatus && broadcast.approvalStatus !== 'APPROVED' && (
                          <div className="text-xs text-gray-500 mt-1">
                            Approval: {broadcast.approvalStatus.toLowerCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {(broadcast.totalRecipients || 0).toLocaleString()}
                        </div>
                        {broadcast.status === 'SENT' && broadcast.successfulSends && (
                          <div className="text-xs text-gray-500">
                            {broadcast.successfulSends.toLocaleString()} sent
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {broadcast.status === 'SENDING' ? (
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${calculateProgress(broadcast)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{calculateProgress(broadcast)}%</span>
                          </div>
                        ) : broadcast.status === 'SENT' ? (
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${getDeliveryRate(broadcast)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{getDeliveryRate(broadcast)}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {broadcast.scheduledFor ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(broadcast.scheduledFor)}
                          </div>
                        ) : broadcast.sentAt ? (
                          formatDate(broadcast.sentAt)
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-1 flex-wrap">
                          <button
                            onClick={() => handleViewStats(broadcast.id)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            title="View Stats"
                          >
                            <BarChart className="w-4 h-4" />
                          </button>
                          
                          {broadcast.status === 'DRAFT' && (
                            <>
                              <button
                                onClick={() => handleApproveBroadcast(broadcast.id)}
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRejectBroadcast(broadcast.id)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          
                          {(broadcast.status === 'DRAFT' || broadcast.status === 'APPROVED') && (
                            <button
                              onClick={() => handleSendBroadcast(broadcast.id)}
                              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                              title="Send Now"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          
                          {broadcast.status === 'SCHEDULED' && (
                            <button
                              onClick={() => handleCancelBroadcast(broadcast.id)}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDuplicateBroadcast(broadcast.id)}
                            className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded"
                            title="Duplicate"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
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
        {broadcasts.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing {broadcasts.length} of {pagination.total} broadcasts
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters((prev: { page: number; }) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setFilters((prev: { page: number; }) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

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

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this broadcast"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Customer Segment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Customer Segment *
                  </label>
                  <select
                    value={formData.segmentId}
                    onChange={(e) => setFormData({ ...formData, segmentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a segment</option>
                    {segments.map((segment) => (
                      <option key={segment.id} value={segment.id}>
                        {segment.name} ({segment.customerCount?.toLocaleString()} customers)
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Or leave empty to use custom filters
                  </p>
                </div>

                {/* Message Template */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Message Template *
                  </label>
                  <select
                    value={formData.templateId}
                    onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a template</option>
                    {templates.map((template) => (
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
                        checked={formData.immediate}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          immediate: true,
                          scheduledFor: undefined 
                        })}
                        className="mr-2"
                      />
                      Send Immediately
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!formData.immediate}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          immediate: false 
                        })}
                        className="mr-2"
                      />
                      Schedule for Later
                    </label>
                  </div>

                  {!formData.immediate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Schedule Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.scheduledFor ? new Date(formData.scheduledFor).toISOString().slice(0, 16) : ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          scheduledFor: e.target.value ? new Date(e.target.value).toISOString() : undefined 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
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
                  {formData.immediate ? 'Send Now' : 'Schedule Broadcast'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Modal */}
        {showStatsModal && statsData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Broadcast Statistics</h2>
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="text-2xl font-bold text-blue-700">{statsData.totalRecipients?.toLocaleString() || 0}</div>
                  <div className="text-sm font-medium text-blue-600">Total Recipients</div>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="text-2xl font-bold text-green-700">{statsData.sent?.toLocaleString() || 0}</div>
                  <div className="text-sm font-medium text-green-600">Successfully Sent</div>
                </div>
                <div className="bg-red-50 rounded-lg p-6">
                  <div className="text-2xl font-bold text-red-700">{statsData.failed?.toLocaleString() || 0}</div>
                  <div className="text-sm font-medium text-red-600">Failed</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="text-2xl font-bold text-yellow-700">{statsData.pending?.toLocaleString() || 0}</div>
                  <div className="text-sm font-medium text-yellow-600">Pending</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Rates</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Open Rate</span>
                        <span className="text-sm font-bold text-gray-900">{statsData.openRate || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${statsData.openRate || 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Click Rate</span>
                        <span className="text-sm font-bold text-gray-900">{statsData.clickRate || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${statsData.clickRate || 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
                        <span className="text-sm font-bold text-gray-900">{statsData.conversionRate || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${statsData.conversionRate || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
                  <div className="space-y-3">
                    {statsData.statusBreakdown && Object.entries(statsData.statusBreakdown).map(([status, count]: [string, any]) => (
                      <div key={status} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{status}</span>
                        <span className="text-sm font-semibold text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}