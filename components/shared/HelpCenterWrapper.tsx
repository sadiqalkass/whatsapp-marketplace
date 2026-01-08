// components/shared/HelpCenterWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import HelpCenter from '@/components/admin/onboarding/HelpCenter';
import TourGuide from '@/components/admin/onboarding/TourGuide';

// Define tour steps for different pages
const dashboardTourSteps = [
  {
    element: '#stats-cards',
    title: 'Key Metrics Dashboard',
    intro: 'Track your marketplace performance with real-time metrics. Monitor revenue, orders, and delivery status.',
    position: 'bottom'
  },
  {
    element: '#order-flow',
    title: 'Order Flow Status',
    intro: 'Monitor orders at every stage - from payment to delivery. Click any status to filter orders.',
    position: 'bottom'
  },
  {
    element: '#revenue-chart',
    title: 'Revenue Analytics',
    intro: 'Visualize your revenue trends with interactive charts. Filter by day, week, or month.',
    position: 'top'
  },
  {
    element: '#video-call-section',
    title: 'Video Support',
    intro: 'Start video calls directly from chats for face-to-face customer support and dispute resolution.',
    position: 'left'
  },
  {
    element: '#quick-actions',
    title: 'Quick Actions',
    intro: 'Access frequently used actions like merchant verification and report downloads.',
    position: 'right'
  }
];

const chatsTourSteps = [
  {
    element: '#chat-list',
    title: 'Customer Conversations',
    intro: 'View all active customer chats. Green dots indicate online customers.',
    position: 'right'
  },
  {
    element: '#video-call-button',
    title: 'Video Call Feature',
    intro: 'Start video calls for complex issues. Red button appears for disputes.',
    position: 'left'
  },
  {
    element: '#order-context',
    title: 'Customer Context',
    intro: 'See customer order history and stats while chatting.',
    position: 'left'
  },
  {
    element: '#tags-section',
    title: 'Chat Tags',
    intro: 'Tag conversations to categorize them (VIP, Issue, New Customer, etc.).',
    position: 'bottom'
  }
];

const onboardingTourSteps = [
  {
    element: '#verification-steps',
    title: 'Merchant Verification',
    intro: 'Review and verify merchant documents step by step.',
    position: 'bottom'
  },
  {
    element: '#kyc-documents',
    title: 'KYC Documents',
    intro: 'View uploaded documents by clicking "View Documents".',
    position: 'right'
  },
  {
    element: '#approve-reject',
    title: 'Approve or Reject',
    intro: 'Approve each step or reject with a reason if documents are insufficient.',
    position: 'top'
  }
];

const merchantDashboardTourSteps = [
  {
    element: '#merchant-stats',
    title: 'Store Performance',
    intro: 'Track your store metrics including revenue, orders, and customer ratings.',
    position: 'bottom'
  },
  {
    element: '#product-management',
    title: 'Product Management',
    intro: 'Add, edit, and manage your products. Sync with WhatsApp catalog for direct sales.',
    position: 'right'
  },
  {
    element: '#order-management',
    title: 'Order Management',
    intro: 'View and manage customer orders. Update status and track deliveries.',
    position: 'left'
  },
  {
    element: '#customer-chats',
    title: 'Customer Chats',
    intro: 'Communicate directly with customers via WhatsApp for support and sales.',
    position: 'top'
  }
];

export default function HelpCenterWrapper() {
  const pathname = usePathname();
  
  // Function to get tour steps based on current path
  const getTourSteps = () => {
    if (pathname?.startsWith('/admin')) {
      switch (true) {
        case pathname === '/admin' || pathname === '/admin/dashboard':
          return dashboardTourSteps;
        case pathname === '/admin/chats':
          return chatsTourSteps;
        case pathname === '/admin/onboarding':
          return onboardingTourSteps;
        default:
          return null;
      }
    } else if (pathname?.startsWith('/merchant')) {
      switch (true) {
        case pathname === '/merchant' || pathname === '/merchant/dashboard':
          return merchantDashboardTourSteps;
        case pathname === '/merchant/products':
          return [
            {
              element: '#product-list',
              title: 'Product Catalog',
              intro: 'Manage your products. Add new products, edit existing ones, or sync to WhatsApp catalog.',
              position: 'bottom'
            },
            {
              element: '#add-product-btn',
              title: 'Add New Product',
              intro: 'Click here to add new products to your store.',
              position: 'left'
            },
            {
              element: '#whatsapp-sync',
              title: 'WhatsApp Sync',
              intro: 'Sync products to WhatsApp catalog for direct sales through chat.',
              position: 'right'
            }
          ];
        case pathname === '/merchant/orders':
          return [
            {
              element: '#order-list',
              title: 'Order Management',
              intro: 'View and manage all customer orders. Filter by status or date.',
              position: 'bottom'
            },
            {
              element: '#order-actions',
              title: 'Order Actions',
              intro: 'Update order status, print invoices, or contact customers.',
              position: 'right'
            }
          ];
        default:
          return null;
      }
    }
    return null;
  };
  
  const tourSteps = getTourSteps();
  const tourId = pathname?.replace(/\//g, '-').substring(1) || 'default-tour';

  return (
    <>
      <HelpCenter />
      {tourSteps && (
        <TourGuide
          tourId={tourId}
          steps={tourSteps}
          autoStart={false} // Set to true if you want auto-start
          onComplete={() => console.log(`${tourId} completed`)}
        />
      )}
    </>
  );
}