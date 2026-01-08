// types/broadcast.types.ts

// ========== TEMPLATE TYPES ==========
export interface BroadcastTemplate {
    id: string;
    name: string;
    description?: string;
    category: string;
    header?: string;
    body: string;
    footer?: string;
    variables: string[];
    languageCode: string;
    sampleData?: Record<string, string>;
    approvalStatus: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISABLED';
    whatsappTemplateName?: string;
    whatsappTemplateId?: string;
    submittedAt?: Date;
    approvedAt?: Date;
    rejectedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    creator?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface CreateTemplateDTO {
    name: string;
    description?: string;
    category: string;
    header?: string;
    body: string;
    footer?: string;
    variables?: string[];
    languageCode?: string;
    sampleData?: Record<string, string>;
}

export interface UpdateTemplateDTO {
    name?: string;
    description?: string;
    category?: string;
    header?: string;
    body?: string;
    footer?: string;
    variables?: string[];
    languageCode?: string;
    sampleData?: Record<string, string>;
}

export interface SubmitTemplateDTO {
    notes?: string;
    reviewerEmails?: string[];
}

export interface TemplateFilters {
    approvalStatus?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    createdBy?: string;
    startDate?: Date;
    endDate?: Date;
}

// ========== BROADCAST TYPES ==========
// Types/broadcast.types.ts
export interface StatusBadgeProps {
    status: string;
    type: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export interface Template {
    id: string;
    name: string;
    description?: string;
    category: string;
    approvalStatus: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISABLED';
    lastUpdated: string;
    content: string;
    variables: string[];
    header?: string;
    footer?: string;
    languageCode?: string;
    sampleData?: Record<string, string>;
    whatsappTemplateName?: string;
    whatsappTemplateId?: string;
    submittedAt?: string;
    approvedAt?: string;
    rejectedAt?: string;
    createdAt?: string;
    creator?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface Broadcast {
    id: string;
    name: string;
    description?: string;
    targetSegment: string;
    segmentId?: string;
    messageType: string;
    status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'CANCELLED' | 'FAILED';
    approvalStatus?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
    sentDate: string;
    recipientCount: number;
    deliveryRate?: number;
    totalRecipients?: number;
    successfulSends?: number;
    failedSends?: number;
    scheduledFor?: string;
    sentAt?: string;
    templateId?: string;
    content?: string;
    customFilter?: any;
    contentVariables?: Record<string, string>;
}

export interface CreateBroadcastDTO {
    name: string;
    description?: string;
    content?: string;
    templateId?: string;
    segmentId?: string;
    customFilter?: any;
    contentVariables?: Record<string, string>;
    scheduledFor?: Date;
    immediate?: boolean;
}

export interface UpdateBroadcastDTO {
    name?: string;
    description?: string;
    content?: string;
    templateId?: string;
    segmentId?: string;
    customFilter?: any;
    contentVariables?: Record<string, string>;
    scheduledFor?: Date;
}

export interface BroadcastFilters {
    status?: string;
    approvalStatus?: string;
    search?: string;
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    templateId?: string;
    segmentId?: string;
    createdBy?: string;
}

export interface BroadcastRecipient {
    id: string;
    broadcastId: string;
    customerPhone: string;
    customerName?: string;
    status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
    whatsappMessageId?: string;
    failureReason?: string;
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    failedAt?: Date;
    customer?: {
        id: string;
        name?: string;
        phone: string;
        email?: string;
    };
}

export interface BroadcastStats {
    totalRecipients: number;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    pending: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    averageResponseTime?: number;
    statusBreakdown: Record<string, number>;
    timeline?: Array<{
        time: string;
        sent: number;
        delivered: number;
        read: number;
        failed: number;
    }>;
}

// ========== COMMON TYPES ==========
export interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface Segment {
    id: string;
    name: string;
    description?: string;
    filters: any;
    customerCount: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}

// Add to Types/broadcast.types.ts

// ========== SEGMENT TYPES ==========
export interface Segment {
  id: string;
  name: string;
  description?: string;
  criteria: any;
  tags: string[];
  color: string;
  customerCount: number;
  purchaseBehavior?: {
    avgOrderValue: number;
    totalRevenue: number;
    lastPurchase: string;
    preferredCategories: string[];
  };
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateSegmentDTO {
  name: string;
  description?: string;
  criteria: any;
  tags?: string[];
  color?: string;
}

export interface UpdateSegmentDTO {
  name?: string;
  description?: string;
  criteria?: any;
  tags?: string[];
  color?: string;
}

export interface SegmentFilters {
  search?: string;
  page?: number;
  limit?: number;
  tags?: string[];
}

export interface SegmentStats {
  totalBroadcasts: number;
  recentBroadcasts: Array<{
    id: string;
    name: string;
    status: string;
    sentAt?: string;
    totalRecipients: number;
    successfulSends: number;
  }>;
  purchaseBehavior: {
    avgOrderValue: number;
    totalRevenue: number;
    lastPurchase: string;
    preferredCategories: string[];
  };
}

export interface SegmentCardProps {
  segment: Segment;
  onClick: () => void;
  onEdit: (segment: Segment) => void;
  onDelete: (id: string) => void;
  onBroadcast: (id: string) => void;
}

export interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  removable?: boolean;
}