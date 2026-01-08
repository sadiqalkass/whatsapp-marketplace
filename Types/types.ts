import { LucideIcon } from 'lucide-react';

type ChatStatus = "online" | "offline";
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;
type VerificationStatus = 'Pending' | 'Verified';
export type OrderStatus = 'Pending' | 'Accepted' | 'Ready' | 'Completed' | 'Rejected';

export interface SidebarItem {
  id: string;
  label: string;
  badge?: number;
  icon?: LucideIcon;
}

export interface SidebarSection {
  section: string;
  icon: LucideIcon;
  items: SidebarItem[];
}

export interface SidebarSingleItem {
  id: string;
  label: string;
  icon: LucideIcon;
}
export interface StatCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon: IconType;
  delay?: number;
}

export interface Chat {
  id: number;
  customer: string;
  phone: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  tags: string[];
  avatar: string;
  status: ChatStatus; // Use the specific type
  orders: {
    id: string;
    item: string;
    amount: number;
    date: string;
  }[];
}

export interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export interface EscrowOrder {
  id: string;
  orderId: string;
  merchantId: string;
  amount: number;
  status: string;
  heldAt: string;
  releasedAt: string | null;
  daysInEscrow: number;
  order: {
    id: string;
    orderNumber: string;
    customerPhone: string;
    customerName: string | null;
    customerEmail: string | null;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    items: any[];
  };
}

export interface StatusBadgeProps {
  status: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export interface Merchant {
  id: string;
  merchant: string;
  availableBalance: string;
  pendingBalance: string;
  lastPayoutDate: string;
  payoutStatus: string;
  canPayout: boolean;
}

export interface Broadcast {
  totalRecipients: number;
  successfulSends: number;
  description: any;
  approvalStatus: boolean;
  failedSends: undefined;
  scheduledFor: string;
  content: any;
  id: string;
  name: string;
  targetSegment: string;
  messageType: string;
  status: 'Draft' | 'Sent' | 'Scheduled';
  sentDate: string;
  recipientCount: number;
  deliveryRate?: number;
}

export interface Template {
  id: string;
  name: string;
  category: 'Promotions' | 'Alerts' | 'Updates' | 'Welcome';
  approvalStatus: 'Approved' | 'Pending' | 'Rejected';
  lastUpdated: string;
  content: string;
  variables: string[];
}

export interface AdCampaign {
  id: string;
  campaignName: string;
  source: 'Facebook' | 'Instagram' | 'Google';
  clicks: number;
  chatsStarted: number;
  ordersGenerated: number;
  conversionRate: number;
  spend: number;
  revenue: number;
  roi: number;
  startDate: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  rate: number;
  enabled: boolean;
}

export interface ConfigData {
  businessHours: {
    enabled: boolean;
    openTime: string;
    closeTime: string;
  };
  deliveryZones: DeliveryZone[];
  defaultDeliveryFee: number;
  orderCutoff: {
    enabled: boolean;
    time: string;
  };
  autoConfirmOrders: boolean;
  allowWeekendDelivery: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Support';
  accessLevel: string;
  status: 'Active' | 'Disabled';
  joinedDate: string;
}

export interface RolePermissions {
  [key: string]: {
    label: string;
    permissions: string[];
  };
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'Communication' | 'Payment' | 'Delivery';
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: string;
  icon: React.ComponentType<{ className?: string }>;
  details: {
    apiKey?: string;
    endpoint?: string;
    version?: string;
  };
}

export interface MerchantProfile {
  businessName: string;
  category: string;
  location: string;
  email: string;
  phone: string;
  verificationStatus: VerificationStatus;
}

export interface Order {
  id: string;
  items: string;
  quantity: number;
  status: OrderStatus;
  pickupTime: string;
  orderDate: string;
  orderNotes?: string;
}