import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HelpCenter from "@/components/admin/onboarding/HelpCenter";
import TourGuide from "@/components/admin/onboarding/TourGuide";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300","400","600","700","800"],
});

export const metadata: Metadata = {
  title: "Marketplace Admin Dashboard",
  description: "Admin dashboard for managing marketplace operations, merchants, and customer support",
};

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

// Component to determine which tour to show based on route
function TourManager({ pathname }: { pathname: string }) {
  switch (pathname) {
    case '/admin':
    case '/admin/dashboard':
      return (
        <TourGuide
          tourId="dashboard-tour"
          steps={dashboardTourSteps}
          autoStart={true}
          onComplete={() => console.log('Dashboard tour completed')}
        />
      );
    case '/admin/chats':
      return (
        <TourGuide
          tourId="chats-tour"
          steps={chatsTourSteps}
          autoStart={true}
          onComplete={() => console.log('Chats tour completed')}
        />
      );
    case '/admin/onboarding':
      return (
        <TourGuide
          tourId="onboarding-tour"
          steps={onboardingTourSteps}
          autoStart={true}
          onComplete={() => console.log('Onboarding tour completed')}
        />
      );
    default:
      return null;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the current pathname (you'll need to use usePathname in client components)
  // For server components, we'll handle it differently
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add intro.js CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/intro.js@7.2.0/minified/introjs.min.css"
        />
      </head>
      <body className={`${inter.variable} antialiased bg-gray-50`}>
        {/* Main Content */}
        <div className="min-h-screen">
          {children}
        </div>
        
        {/* Global Help Components */}
        <HelpCenter />
        
        {/* We'll add TourManager in individual page components since usePathname is client-side */}
      </body>
    </html>
  );
}