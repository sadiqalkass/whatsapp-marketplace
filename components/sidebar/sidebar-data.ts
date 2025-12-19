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
    items: [{ id: 'dashboard', label: 'Dashboard' }],
  },
  {
    section: 'Merchants',
    icon: Store,
    items: [
      { id: 'all-merchants', label: 'All Merchants' },
      { id: 'onboarding', label: 'Onboarding', badge: 3 },
      { id: 'payouts', label: 'Payouts' },
    ],
  },
  {
    section: 'Catalog',
    icon: Package,
    items: [
      { id: 'products', label: 'Products' },
      { id: 'pricing-manager', label: 'Pricing Manager' },
      { id: 'stock-sync', label: 'Stock Sync', badge: 5 },
    ],
  },
  {
    section: 'Orders',
    icon: Truck,
    items: [
      { id: 'active-orders', label: 'Active Orders', badge: 12 },
      { id: 'fulfillment', label: 'Fulfillment' },
      { id: 'returns', label: 'Returns', badge: 2 },
    ],
  },
  {
    section: 'Customers',
    icon: MessageSquare,
    items: [
      { id: 'chats', label: 'Chats', badge: 8 },
      { id: 'segments', label: 'Segments' },
      { id: 'abandoned-carts', label: 'Abandoned Carts', badge: 15 },
    ],
  },
  {
    section: 'Finance',
    icon: DollarSign,
    items: [
      { id: 'escrow', label: 'Escrow' },
      { id: 'settlements', label: 'Settlements' },
      { id: 'reports', label: 'Reports' },
    ],
  },
  {
    section: 'Marketing',
    icon: Megaphone,
    items: [
      { id: 'broadcasts', label: 'Broadcasts' },
      { id: 'templates', label: 'Templates' },
      { id: 'ad-tracking', label: 'Ad Tracking' },
    ],
  },
  {
    section: 'Settings',
    icon: Settings,
    items: [
      { id: 'platform-config', label: 'Platform Config' },
      { id: 'team-roles', label: 'Team Roles' },
      { id: 'integrations', label: 'Integrations' },
    ],
  },
];