import {
  LayoutDashboard,
  Store,
  Package,
  Truck,
  MessageSquare,
  DollarSign,
  Megaphone,
  Settings,
} from 'lucide-react';
import { SidebarSection } from '@/Types/types';

export const sidebarData: SidebarSection[] = [
  {
    section: 'Overview',
    icon: LayoutDashboard,
    items: [{ id: 'admin/dashboard', label: 'Dashboard' }],
  },
  {
    section: 'Merchants',
    icon: Store,
    items: [
      { id: 'admin/all-merchants', label: 'All Merchants' },
      { id: 'admin/onboarding', label: 'Onboarding', badge: 3 },
      { id: 'admin/payouts', label: 'Payouts' },
    ],
  },
  {
    section: 'Catalog',
    icon: Package,
    items: [
      { id: 'admin/products', label: 'Products' },
      { id: 'admin/pricing-manager', label: 'Pricing Manager' },
      { id: 'admin/stock-sync', label: 'Stock Sync', badge: 3 },
    ],
  },
  {
    section: 'Orders',
    icon: Truck,
    items: [
      { id: 'admin/active-orders', label: 'Active Orders', badge: 8 },
      { id: 'admin/fulfillment', label: 'Fulfillment' },
      { id: 'admin/returns', label: 'Returns', badge: 7 },
    ],
  },
  {
    section: 'Customers',
    icon: MessageSquare,
    items: [
      { id: 'admin/chats', label: 'Chats', badge: 6 },
      { id: 'admin/segments', label: 'Segments' },
      { id: 'admin/abandoned-carts', label: 'Abandoned Carts', badge: 8 },
    ],
  },
  {
    section: 'Finance',
    icon: DollarSign,
    items: [
      { id: 'admin/escrow', label: 'Escrow' },
      { id: 'admin/settlements', label: 'Settlements' },
      { id: 'admin/reports', label: 'Reports' },
      { id: 'admin/wallet', label: 'Wallet' },
    ],
  },
  {
    section: 'Marketing',
    icon: Megaphone,
    items: [
      { id: 'admin/broadcasts', label: 'Broadcasts' },
      { id: 'admin/templates', label: 'Templates' },
      { id: 'admin/ad-tracking', label: 'Ad Tracking' },
    ],
  },
  {
    section: 'Settings',
    icon: Settings,
    items: [
      { id: 'admin/platform-config', label: 'Platform Config' },
      { id: 'admin/team-roles', label: 'Team Roles' },
      { id: 'admin/integrations', label: 'Integrations' },
    ],
  },
];