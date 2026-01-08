// services/broadcast.service.ts
import api from '../lib/api';
import { 
  BroadcastTemplate,
  Broadcast,
  BroadcastStats,
  CreateTemplateDTO,
  UpdateTemplateDTO,
  SubmitTemplateDTO,
  CreateBroadcastDTO,
  UpdateBroadcastDTO,
  BroadcastFilters,
  BroadcastRecipient,
  TemplateFilters,
  Pagination,
  Segment,
  CreateSegmentDTO,
  UpdateSegmentDTO,
  SegmentFilters,
  SegmentStats
} from '../Types/broadcast.types';

export interface CreateTemplateResponse {
  success: boolean;
  data: BroadcastTemplate;
  message: string;
}

export interface GetTemplatesResponse {
  success: boolean;
  data: BroadcastTemplate[];
  pagination: Pagination;
}

export interface GetTemplateResponse {
  success: boolean;
  data: BroadcastTemplate;
}

export interface UpdateTemplateResponse {
  success: boolean;
  data: BroadcastTemplate;
  message: string;
}

export interface DeleteTemplateResponse {
  success: boolean;
  message: string;
}

export interface SubmitTemplateResponse {
  success: boolean;
  data: BroadcastTemplate;
  message: string;
}

export interface CreateBroadcastResponse {
  success: boolean;
  data: Broadcast;
  message: string;
}

export interface GetBroadcastsResponse {
  success: boolean;
  data: Broadcast[];
  pagination: Pagination;
}

export interface GetBroadcastResponse {
  success: boolean;
  data: Broadcast;
}

export interface UpdateBroadcastResponse {
  success: boolean;
  data: Broadcast;
  message: string;
}

export interface SubmitBroadcastResponse {
  success: boolean;
  data: Broadcast;
  message: string;
}

export interface ApproveBroadcastResponse {
  success: boolean;
  data: Broadcast;
  message: string;
}

export interface RejectBroadcastResponse {
  success: boolean;
  data: Broadcast;
  message: string;
}

export interface SendBroadcastResponse {
  success: boolean;
  data: Broadcast;
  message: string;
}

export interface GetBroadcastStatsResponse {
  success: boolean;
  data: BroadcastStats;
}

export interface CancelBroadcastResponse {
  success: boolean;
  data: Broadcast;
  message: string;
}

export interface GetBroadcastRecipientsResponse {
  success: boolean;
  data: BroadcastRecipient[];
  pagination: Pagination;
}

export interface TemplateApprovalStatus {
  id: string;
  name: string;
  approvalStatus: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  whatsappTemplateName?: string;
  whatsappTemplateId?: string;
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
}

export interface BatchOperationResult {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}

export interface BroadcastSchedule {
  id: string;
  broadcastId: string;
  scheduledFor: Date;
  status: 'SCHEDULED' | 'PROCESSING' | 'SENT' | 'CANCELLED';
  createdAt: Date;
}

// Segment-specific interfaces
export interface CreateSegmentResponse {
  success: boolean;
  data: Segment;
  message: string;
}

export interface GetSegmentsResponse {
  success: boolean;
  data: Segment[];
  pagination: Pagination;
}

export interface GetSegmentResponse {
  success: boolean;
  data: Segment;
}

export interface UpdateSegmentResponse {
  success: boolean;
  data: Segment;
  message: string;
}

export interface DeleteSegmentResponse {
  success: boolean;
  message: string;
}

export interface SegmentEstimateResponse {
  success: boolean;
  data: { count: number };
  message: string;
}

export interface DuplicateSegmentResponse {
  success: boolean;
  data: Segment;
  message: string;
}

export interface GetSegmentTagsResponse {
  success: boolean;
  data: string[];
}

export interface GetSegmentStatsResponse {
  success: boolean;
  data: SegmentStats;
}

export interface GetSegmentCustomersResponse {
  success: boolean;
  data: any[];
  pagination: Pagination;
}

export interface ExportSegmentResponse {
  success: boolean;
  data: string;
  message: string;
}

export interface ImportSegmentsResponse {
  success: boolean;
  data: {
    imported: number;
    failed: number;
    errors: Array<{ row: number; error: string }>;
  };
  message: string;
}

export interface BatchSegmentOperationResult {
  success: boolean;
  data: {
    processed: number;
    succeeded: number;
    failed: number;
    errors: Array<{ id: string; error: string }>;
  };
  message: string;
}

export interface SegmentsAnalyticsResponse {
  success: boolean;
  data: {
    totalSegments: number;
    segmentsByColor: Record<string, number>;
    averageCustomersPerSegment: number;
    segmentsCreatedOverTime: Array<{ date: string; count: number }>;
    topSegmentsByUsage: Array<{ id: string; name: string; usageCount: number }>;
    tagsDistribution: Record<string, number>;
  };
}

export const broadcastService = {
  // ========== TEMPLATE MANAGEMENT ==========

  async createTemplate(data: CreateTemplateDTO): Promise<CreateTemplateResponse> {
    const response = await api.post('/admin/broadcast/templates', data);
    return response.data;
  },

  async getTemplates(filters: TemplateFilters = {}): Promise<GetTemplatesResponse> {
    const params = new URLSearchParams();
    
    if (filters.approvalStatus) params.append('approvalStatus', filters.approvalStatus);
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/admin/broadcast/templates?${params.toString()}`);
    return response.data;
  },

  async getTemplate(id: string): Promise<GetTemplateResponse> {
    const response = await api.get(`/admin/broadcast/templates/${id}`);
    return response.data;
  },

  async updateTemplate(id: string, data: UpdateTemplateDTO): Promise<UpdateTemplateResponse> {
    const response = await api.put(`/admin/broadcast/templates/${id}`, data);
    return response.data;
  },

  async deleteTemplate(id: string): Promise<DeleteTemplateResponse> {
    const response = await api.delete(`/admin/broadcast/templates/${id}`);
    return response.data;
  },

  async submitTemplateForApproval(id: string, data: SubmitTemplateDTO): Promise<SubmitTemplateResponse> {
    const response = await api.post(`/admin/broadcast/templates/${id}/submit`, data);
    return response.data;
  },

  async checkTemplateApprovalStatus(id: string): Promise<{ success: boolean; data: TemplateApprovalStatus }> {
    const response = await api.get(`/admin/broadcast/templates/${id}/approval-status`);
    return response.data;
  },

  async getTemplateCategories(): Promise<{ success: boolean; data: string[] }> {
    const response = await api.get('/admin/broadcast/templates/categories');
    return response.data;
  },

  async duplicateTemplate(id: string, newName: string): Promise<CreateTemplateResponse> {
    const response = await api.post(`/admin/broadcast/templates/${id}/duplicate`, { newName });
    return response.data;
  },

  async exportTemplates(ids: string[]): Promise<{ success: boolean; data: string; message: string }> {
    const response = await api.post('/admin/broadcast/templates/export', { ids });
    return response.data;
  },

  async importTemplates(file: File): Promise<{ success: boolean; data: BatchOperationResult; message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/admin/broadcast/templates/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ========== BROADCAST MANAGEMENT ==========

  async createBroadcast(data: CreateBroadcastDTO): Promise<CreateBroadcastResponse> {
    const response = await api.post('/admin/broadcast/broadcasts', data);
    return response.data;
  },

  async getBroadcasts(filters: BroadcastFilters = {}): Promise<GetBroadcastsResponse> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.approvalStatus) params.append('approvalStatus', filters.approvalStatus);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
    if (filters.templateId) params.append('templateId', filters.templateId);
    if (filters.segmentId) params.append('segmentId', filters.segmentId);
    
    const response = await api.get(`/admin/broadcast/broadcasts?${params.toString()}`);
    return response.data;
  },

  async getBroadcast(id: string): Promise<GetBroadcastResponse> {
    const response = await api.get(`/admin/broadcast/broadcasts/${id}`);
    return response.data;
  },

  async updateBroadcast(id: string, data: UpdateBroadcastDTO): Promise<UpdateBroadcastResponse> {
    const response = await api.put(`/admin/broadcast/broadcasts/${id}`, data);
    return response.data;
  },

  async deleteBroadcast(id: string): Promise<DeleteTemplateResponse> {
    const response = await api.delete(`/admin/broadcast/broadcasts/${id}`);
    return response.data;
  },

  async submitBroadcastForApproval(id: string): Promise<SubmitBroadcastResponse> {
    const response = await api.post(`/admin/broadcast/broadcasts/${id}/submit`);
    return response.data;
  },

  async approveBroadcast(id: string, notes?: string): Promise<ApproveBroadcastResponse> {
    const response = await api.post(`/admin/broadcast/broadcasts/${id}/approve`, { notes });
    return response.data;
  },

  async rejectBroadcast(id: string, rejectionReason: string): Promise<RejectBroadcastResponse> {
    const response = await api.post(`/admin/broadcast/broadcasts/${id}/reject`, { rejectionReason });
    return response.data;
  },

  async sendBroadcast(id: string): Promise<SendBroadcastResponse> {
    const response = await api.post(`/admin/broadcast/broadcasts/${id}/send`);
    return response.data;
  },

  async cancelBroadcast(id: string): Promise<CancelBroadcastResponse> {
    const response = await api.post(`/admin/broadcast/broadcasts/${id}/cancel`);
    return response.data;
  },

  async pauseBroadcast(id: string): Promise<UpdateBroadcastResponse> {
    const response = await api.post(`/admin/broadcast/broadcasts/${id}/pause`);
    return response.data;
  },

  async resumeBroadcast(id: string): Promise<UpdateBroadcastResponse> {
    const response = await api.post(`/admin/broadcast/broadcasts/${id}/resume`);
    return response.data;
  },

  async duplicateBroadcast(id: string, newName: string): Promise<CreateBroadcastResponse> {
    const response = await api.post(`/admin/broadcast/broadcasts/${id}/duplicate`, { newName });
    return response.data;
  },

  async getBroadcastStats(id: string): Promise<GetBroadcastStatsResponse> {
    const response = await api.get(`/admin/broadcast/broadcasts/${id}/stats`);
    return response.data;
  },

  async getBroadcastRecipients(
    id: string, 
    filters: { 
      status?: string; 
      search?: string;
      page?: number; 
      limit?: number;
    } = {}
  ): Promise<GetBroadcastRecipientsResponse> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page?.toString() || '1');
    if (filters.limit) params.append('limit', filters.limit?.toString() || '50');
    
    const response = await api.get(`/admin/broadcast/broadcasts/${id}/recipients?${params.toString()}`);
    return response.data;
  },

  async exportBroadcastRecipients(id: string, format: 'csv' | 'json' = 'csv'): Promise<{ 
    success: boolean; 
    data: string; 
    message: string 
  }> {
    const response = await api.get(`/admin/broadcast/broadcasts/${id}/recipients/export?format=${format}`);
    return response.data;
  },

  async resendFailedBroadcast(id: string): Promise<SendBroadcastResponse> {
    const response = await api.post(`/admin/broadcast/broadcasts/${id}/resend-failed`);
    return response.data;
  },

  // ========== SEGMENT MANAGEMENT ==========

  async createSegment(data: CreateSegmentDTO): Promise<CreateSegmentResponse> {
    const response = await api.post('/admin/broadcast/segments', data);
    return response.data;
  },

  async getSegments(filters: SegmentFilters = {}): Promise<GetSegmentsResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','));
    }
    
    const response = await api.get(`/admin/broadcast/segments?${params.toString()}`);
    return response.data;
  },

  async getSegment(id: string): Promise<GetSegmentResponse> {
    const response = await api.get(`/admin/broadcast/segments/${id}`);
    return response.data;
  },

  async updateSegment(id: string, data: UpdateSegmentDTO): Promise<UpdateSegmentResponse> {
    const response = await api.put(`/admin/broadcast/segments/${id}`, data);
    return response.data;
  },

  async deleteSegment(id: string): Promise<DeleteSegmentResponse> {
    const response = await api.delete(`/admin/broadcast/segments/${id}`);
    return response.data;
  },

  async getSegmentStats(id: string): Promise<GetSegmentStatsResponse> {
    const response = await api.get(`/admin/broadcast/segments/${id}/stats`);
    return response.data;
  },

  async estimateSegmentSize(criteria: any): Promise<SegmentEstimateResponse> {
    const response = await api.post('/admin/broadcast/segments/estimate', { criteria });
    return response.data;
  },

  async duplicateSegment(id: string, newName: string): Promise<DuplicateSegmentResponse> {
    const response = await api.post(`/admin/broadcast/segments/${id}/duplicate`, { newName });
    return response.data;
  },

  async getSegmentTags(): Promise<GetSegmentTagsResponse> {
    const response = await api.get('/admin/broadcast/segments/tags');
    return response.data;
  },

  async getSegmentCustomers(id: string, page: number = 1, limit: number = 50): Promise<GetSegmentCustomersResponse> {
    const response = await api.get(`/admin/broadcast/segments/${id}/customers?page=${page}&limit=${limit}`);
    return response.data;
  },

  async exportSegmentCustomers(id: string, format: 'csv' | 'json' = 'csv'): Promise<ExportSegmentResponse> {
    const response = await api.get(`/admin/broadcast/segments/${id}/export?format=${format}`);
    return response.data;
  },

  async importSegmentsFromCsv(file: File): Promise<ImportSegmentsResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/admin/broadcast/segments/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async batchDeleteSegments(ids: string[]): Promise<BatchSegmentOperationResult> {
    const response = await api.post('/admin/broadcast/segments/batch/delete', { ids });
    return response.data;
  },

  async batchCreateSegments(segments: CreateSegmentDTO[]): Promise<BatchSegmentOperationResult> {
    const response = await api.post('/admin/broadcast/segments/batch', { segments });
    return response.data;
  },

  async getSegmentsAnalytics(startDate?: string, endDate?: string): Promise<SegmentsAnalyticsResponse> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/admin/broadcast/segments/analytics?${params.toString()}`);
    return response.data;
  },

  // ========== SCHEDULING ==========

  async getScheduledBroadcasts(): Promise<{ success: boolean; data: BroadcastSchedule[] }> {
    const response = await api.get('/admin/broadcast/schedules');
    return response.data;
  },

  async scheduleBroadcast(broadcastId: string, scheduledFor: Date): Promise<{ 
    success: boolean; 
    data: BroadcastSchedule;
    message: string 
  }> {
    const response = await api.post('/admin/broadcast/schedules', { broadcastId, scheduledFor });
    return response.data;
  },

  async updateSchedule(scheduleId: string, scheduledFor: Date): Promise<{ 
    success: boolean; 
    data: BroadcastSchedule;
    message: string 
  }> {
    const response = await api.put(`/admin/broadcast/schedules/${scheduleId}`, { scheduledFor });
    return response.data;
  },

  async cancelSchedule(scheduleId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/admin/broadcast/schedules/${scheduleId}`);
    return response.data;
  },

  // ========== ANALYTICS & STATISTICS ==========

  async getBroadcastAnalytics(startDate?: Date, endDate?: Date): Promise<{ 
    success: boolean; 
    data: {
      totalBroadcasts: number;
      totalRecipients: number;
      totalMessages: number;
      averageResponseRate: number;
      averageOpenRate: number;
      averageClickRate: number;
      topTemplates: Array<{ name: string; count: number; approvalRate: number }>;
      broadcastsByStatus: Record<string, number>;
      broadcastsByDay: Array<{ date: string; count: number; sent: number }>;
    }
  }> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    
    const response = await api.get(`/admin/broadcast/analytics?${params.toString()}`);
    return response.data;
  },

  async getTemplateAnalytics(): Promise<{ 
    success: boolean; 
    data: {
      totalTemplates: number;
      templatesByStatus: Record<string, number>;
      templatesByCategory: Record<string, number>;
      approvalRate: number;
      averageApprovalTime: string;
      topCategories: Array<{ category: string; count: number; usageCount: number }>;
    }
  }> {
    const response = await api.get('/admin/broadcast/templates/analytics');
    return response.data;
  },

  async getBroadcastPerformance(id: string): Promise<{ 
    success: boolean; 
    data: {
      deliveryRate: number;
      openRate: number;
      clickRate: number;
      responseRate: number;
      conversionRate: number;
      costPerMessage: number;
      roi: number;
      timeline: Array<{ time: string; delivered: number; opened: number; clicked: number }>;
      comparison: {
        averageDeliveryRate: number;
        averageOpenRate: number;
        averageClickRate: number;
      };
    }
  }> {
    const response = await api.get(`/admin/broadcast/broadcasts/${id}/performance`);
    return response.data;
  },

  // ========== BATCH OPERATIONS ==========

  async batchDeleteTemplates(ids: string[]): Promise<{ 
    success: boolean; 
    data: BatchOperationResult;
    message: string 
  }> {
    const response = await api.post('/admin/broadcast/templates/batch/delete', { ids });
    return response.data;
  },

  async batchSubmitTemplates(ids: string[]): Promise<{ 
    success: boolean; 
    data: BatchOperationResult;
    message: string 
  }> {
    const response = await api.post('/admin/broadcast/templates/batch/submit', { ids });
    return response.data;
  },

  async batchDeleteBroadcasts(ids: string[]): Promise<{ 
    success: boolean; 
    data: BatchOperationResult;
    message: string 
  }> {
    const response = await api.post('/admin/broadcast/broadcasts/batch/delete', { ids });
    return response.data;
  },

  async batchSendBroadcasts(ids: string[]): Promise<{ 
    success: boolean; 
    data: BatchOperationResult;
    message: string 
  }> {
    const response = await api.post('/admin/broadcast/broadcasts/batch/send', { ids });
    return response.data;
  },

  // ========== VALIDATION & TESTING ==========

  async validateTemplate(data: CreateTemplateDTO): Promise<{ 
    success: boolean; 
    data: {
      valid: boolean;
      warnings: string[];
      errors: string[];
      samplePreview: string;
    };
    message: string 
  }> {
    const response = await api.post('/admin/broadcast/templates/validate', data);
    return response.data;
  },

  async testTemplate(id: string, phoneNumber: string, variables?: Record<string, string>): Promise<{ 
    success: boolean; 
    data: { messageId: string };
    message: string 
  }> {
    const response = await api.post(`/admin/broadcast/templates/${id}/test`, { phoneNumber, variables });
    return response.data;
  },

  async previewBroadcast(id: string): Promise<{ 
    success: boolean; 
    data: {
      message: string;
      variables: Record<string, string>;
      sampleRecipients: Array<{ phone: string; preview: string }>;
    };
    message: string 
  }> {
    const response = await api.get(`/admin/broadcast/broadcasts/${id}/preview`);
    return response.data;
  },

  // ========== SETTINGS & CONFIGURATION ==========

  async getBroadcastSettings(): Promise<{ 
    success: boolean; 
    data: {
      rateLimit: {
        maxPerDay: number;
        maxPerHour: number;
        maxPerMinute: number;
        currentUsage: number;
      };
      approvalSettings: {
        requireApproval: boolean;
        approvers: string[];
        autoApproveFor: string[];
      };
      scheduling: {
        allowedHours: { start: number; end: number };
        timezone: string;
        blackoutDates: string[];
      };
      notifications: {
        onApproval: boolean;
        onSend: boolean;
        onComplete: boolean;
        recipients: string[];
      };
    }
  }> {
    const response = await api.get('/admin/broadcast/settings');
    return response.data;
  },

  async updateBroadcastSettings(data: any): Promise<{ success: boolean; message: string }> {
    const response = await api.put('/admin/broadcast/settings', data);
    return response.data;
  },


  // ========== UTILITY FUNCTIONS ==========

  formatBroadcastStats(stats: BroadcastStats): {
    total: number;
    sent: number;
    failed: number;
    pending: number;
    rates: {
      delivery: string;
      open: string;
      click: string;
      conversion: string;
    };
  } {
    const deliveryRate = stats.totalRecipients > 0 
      ? ((stats.sent / stats.totalRecipients) * 100).toFixed(1)
      : '0.0';

    return {
      total: stats.totalRecipients,
      sent: stats.sent,
      failed: stats.failed,
      pending: stats.pending,
      rates: {
        delivery: `${deliveryRate}%`,
        open: `${stats.openRate}%`,
        click: `${stats.clickRate}%`,
        conversion: `${stats.conversionRate}%`,
      },
    };
  },

  formatBroadcastStatus(status: string): { label: string; color: string } {
    const statusMap: Record<string, { label: string; color: string }> = {
      DRAFT: { label: 'Draft', color: 'gray' },
      PENDING_APPROVAL: { label: 'Pending Approval', color: 'yellow' },
      APPROVED: { label: 'Approved', color: 'green' },
      REJECTED: { label: 'Rejected', color: 'red' },
      SCHEDULED: { label: 'Scheduled', color: 'blue' },
      SENDING: { label: 'Sending', color: 'purple' },
      SENT: { label: 'Sent', color: 'green' },
      CANCELLED: { label: 'Cancelled', color: 'gray' },
      FAILED: { label: 'Failed', color: 'red' },
    };

    return statusMap[status] || { label: status, color: 'gray' };
  },

  formatTemplateStatus(status: string): { label: string; color: string } {
    const statusMap: Record<string, { label: string; color: string }> = {
      DRAFT: { label: 'Draft', color: 'gray' },
      PENDING: { label: 'Pending', color: 'yellow' },
      APPROVED: { label: 'Approved', color: 'green' },
      REJECTED: { label: 'Rejected', color: 'red' },
      DISABLED: { label: 'Disabled', color: 'gray' },
    };

    return statusMap[status] || { label: status, color: 'gray' };
  },

  formatSegmentColor(color: string): { 
    bg: string; 
    text: string; 
    border: string 
  } {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      'purple': {
        bg: 'bg-purple-50',
        text: 'text-purple-800',
        border: 'border-purple-200'
      },
      'blue': {
        bg: 'bg-blue-50',
        text: 'text-blue-800',
        border: 'border-blue-200'
      },
      'red': {
        bg: 'bg-red-50',
        text: 'text-red-800',
        border: 'border-red-200'
      },
      'green': {
        bg: 'bg-green-50',
        text: 'text-green-800',
        border: 'border-green-200'
      },
      'yellow': {
        bg: 'bg-yellow-50',
        text: 'text-yellow-800',
        border: 'border-yellow-200'
      },
      'indigo': {
        bg: 'bg-indigo-50',
        text: 'text-indigo-800',
        border: 'border-indigo-200'
      },
    };

    return colorMap[color] || colorMap['purple'];
  },

  calculateBroadcastProgress(broadcast: any): number {
    const total = broadcast.totalRecipients || 0;
    const sent = broadcast.successfulSends || 0;
    
    if (total === 0) return 0;
    return Math.min(100, Math.round((sent / total) * 100));
  },

  calculateSegmentRevenue(segment: Segment): number {
    return segment.purchaseBehavior?.totalRevenue || 0;
  },

  formatSegmentCriteria(criteria: any): string[] {
    const criteriaStrings: string[] = [];
    
    Object.entries(criteria).forEach(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
      criteriaStrings.push(`${formattedKey}: ${value}`);
    });
    
    return criteriaStrings;
  },

  validateSegmentCriteria(criteria: any): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!criteria || Object.keys(criteria).length === 0) {
      errors.push('At least one criteria is required');
    }

    // Validate specific criteria types
    if (criteria.minOrders && isNaN(Number(criteria.minOrders))) {
      errors.push('Minimum orders must be a number');
    }

    if (criteria.minSpent && isNaN(Number(criteria.minSpent))) {
      errors.push('Minimum spent must be a number');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  estimateSendTime(recipientCount: number, batchSize: number = 50): string {
    const batches = Math.ceil(recipientCount / batchSize);
    const totalSeconds = batches * 2; // Assuming 2 seconds per batch
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  },

  // ========== TEMPLATE VARIABLE HELPERS ==========

  extractTemplateVariables(templateBody: string): string[] {
    const regex = /{{(\w+)}}/g;
    const variables: string[] = [];
    let match;
    
    while ((match = regex.exec(templateBody)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    
    return variables;
  },

  validateTemplateVariables(templateBody: string, providedVariables: Record<string, string>): {
    valid: boolean;
    missing: string[];
    extra: string[];
  } {
    const requiredVariables = this.extractTemplateVariables(templateBody);
    const providedKeys = Object.keys(providedVariables || {});
    
    const missing = requiredVariables.filter(v => !providedKeys.includes(v));
    const extra = providedKeys.filter(v => !requiredVariables.includes(v));
    
    return {
      valid: missing.length === 0,
      missing,
      extra,
    };
  },

  fillTemplateVariables(templateBody: string, variables: Record<string, string>): string {
    let result = templateBody;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });
    
    return result;
  },

  // ========== SEGMENT UTILITY FUNCTIONS ==========

  getSegmentColors(): Array<{ value: string; label: string; bg: string; border: string }> {
    return [
      { value: 'purple', label: 'Purple', bg: 'bg-purple-500', border: 'border-purple-500' },
      { value: 'blue', label: 'Blue', bg: 'bg-blue-500', border: 'border-blue-500' },
      { value: 'red', label: 'Red', bg: 'bg-red-500', border: 'border-red-500' },
      { value: 'green', label: 'Green', bg: 'bg-green-500', border: 'border-green-500' },
      { value: 'yellow', label: 'Yellow', bg: 'bg-yellow-500', border: 'border-yellow-500' },
      { value: 'indigo', label: 'Indigo', bg: 'bg-indigo-500', border: 'border-indigo-500' },
    ];
  },

  getCriteriaOptions(): Array<{ id: string; label: string; type: string; placeholder: string }> {
    return [
      { id: 'minOrders', label: 'Minimum Orders', type: 'number', placeholder: 'e.g., 3' },
      { id: 'maxOrders', label: 'Maximum Orders', type: 'number', placeholder: 'e.g., 5' },
      { id: 'minSpent', label: 'Minimum Amount Spent', type: 'number', placeholder: 'e.g., 200000' },
      { id: 'joinedWithin', label: 'Joined Within', type: 'text', placeholder: 'e.g., 30 days' },
      { id: 'lastPurchase', label: 'Last Purchase', type: 'text', placeholder: 'e.g., 60+ days ago' },
      { id: 'previousOrders', label: 'Previous Orders', type: 'text', placeholder: 'e.g., 2+' },
      { id: 'usedDiscounts', label: 'Used Discounts', type: 'text', placeholder: 'e.g., 3+' },
      { id: 'firstOrderValue', label: 'First Order Value', type: 'text', placeholder: 'e.g., 50000+' },
    ];
  },

  getDefaultTagOptions(): string[] {
    return [
      'VIP', 'High Spender', 'New Customer', 'First Order', 'Inactive',
      'Needs Attention', 'Active', 'Loyal', 'Negotiating', 'Discount User',
      'High Value', 'Business', 'WhatsApp-registered', 'Blocked'
    ];
  },

  getDefaultCategoryOptions(): string[] {
    return [
      'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports',
      'Books', 'Grocery', 'Health', 'Automotive', 'Toys'
    ];
  },
};

export default broadcastService;