'use client';

import { useState } from 'react';
import { CheckCircle, Clock, XCircle, FileText, MapPin, Package, ChevronDown, ChevronUp } from 'lucide-react';

type StepStatus = 'pending' | 'approved' | 'rejected';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface OnboardingStep {
  id: string;
  name: string;
  status: StepStatus;
  icon: IconType;
  completedDate?: string;
  notes?: string;
}

interface OnboardingMerchant {
  id: string;
  name: string;
  category: string;
  appliedDate: string;
  currentStep: string;
  progress: number;
  steps: OnboardingStep[];
}

const mockOnboardingMerchants: OnboardingMerchant[] = [
  {
    id: 'OB001',
    name: 'Urban Style Boutique',
    category: 'Fashion & Apparel',
    appliedDate: '2024-12-18',
    currentStep: 'Product Sample Review',
    progress: 66,
    steps: [
      {
        id: 'id-verify',
        name: 'ID Verification',
        status: 'approved',
        icon: FileText,
        completedDate: '2024-12-18',
      },
      {
        id: 'location-verify',
        name: 'Location Verification',
        status: 'approved',
        icon: MapPin,
        completedDate: '2024-12-19',
      },
      {
        id: 'product-sample',
        name: 'Product Sample Review',
        status: 'pending',
        icon: Package,
      },
    ],
  },
  {
    id: 'OB002',
    name: 'Smart Gadgets NG',
    category: 'Electronics',
    appliedDate: '2024-12-19',
    currentStep: 'Location Verification',
    progress: 33,
    steps: [
      {
        id: 'id-verify',
        name: 'ID Verification',
        status: 'approved',
        icon: FileText,
        completedDate: '2024-12-19',
      },
      {
        id: 'location-verify',
        name: 'Location Verification',
        status: 'pending',
        icon: MapPin,
      },
      {
        id: 'product-sample',
        name: 'Product Sample Review',
        status: 'pending',
        icon: Package,
      },
    ],
  },
  {
    id: 'OB003',
    name: 'Organic Farm Fresh',
    category: 'Food & Beverages',
    appliedDate: '2024-12-17',
    currentStep: 'ID Verification',
    progress: 33,
    steps: [
      {
        id: 'id-verify',
        name: 'ID Verification',
        status: 'rejected',
        icon: FileText,
        notes: 'Document unclear, please resubmit',
      },
      {
        id: 'location-verify',
        name: 'Location Verification',
        status: 'pending',
        icon: MapPin,
      },
      {
        id: 'product-sample',
        name: 'Product Sample Review',
        status: 'pending',
        icon: Package,
      },
    ],
  },
];

const StepStatusIcon = ({ status }: { status: StepStatus }) => {
  if (status === 'approved') {
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  }
  if (status === 'rejected') {
    return <XCircle className="w-5 h-5 text-red-600" />;
  }
  return <Clock className="w-5 h-5 text-yellow-600" />;
};

const OnboardingMerchantCard = ({ merchant, onAction }: { merchant: OnboardingMerchant; onAction: (action: string, merchantId: string, stepId?: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  const handleReject = (stepId: string) => {
    if (rejectReason.trim()) {
      onAction('reject-step', merchant.id, stepId);
      setShowRejectModal(null);
      setRejectReason('');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{merchant.name}</h3>
            <p className="text-sm text-gray-600">{merchant.category}</p>
            <p className="text-xs text-gray-500 mt-1">Applied: {merchant.appliedDate}</p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{merchant.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${merchant.progress}%` }}
            />
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Current Step: <span className="font-medium text-gray-900">{merchant.currentStep}</span>
        </div>

        {isExpanded && (
          <div className="space-y-4 mt-6 pt-6 border-t border-gray-200">
            {merchant.steps.map((step) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <StepStatusIcon status={step.status} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <step.icon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{step.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {step.status === 'approved' && `Completed on ${step.completedDate}`}
                    {step.status === 'pending' && 'Awaiting review'}
                    {step.status === 'rejected' && step.notes}
                  </p>
                  {step.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => onAction('approve-step', merchant.id, step.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Approve Step
                      </button>
                      <button
                        onClick={() => setShowRejectModal(step.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {merchant.progress === 100 && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => onAction('final-approve', merchant.id)}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Final Approval - Activate Merchant
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Reject Step</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows={4}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function OnboardingPage() {
  const [merchants, setMerchants] = useState(mockOnboardingMerchants);

  const handleAction = (action: string, merchantId: string, stepId?: string) => {
    console.log(`Action: ${action} for merchant ${merchantId}, step ${stepId}`);
    
    if (action === 'approve-step' && stepId) {
      setMerchants(prev =>
        prev.map(m => {
          if (m.id === merchantId) {
            const updatedSteps = m.steps.map(s =>
              s.id === stepId
                ? { ...s, status: 'approved' as StepStatus, completedDate: new Date().toISOString().split('T')[0] }
                : s
            );
            const approvedCount = updatedSteps.filter(s => s.status === 'approved').length;
            const progress = Math.round((approvedCount / updatedSteps.length) * 100);
            const currentStep = updatedSteps.find(s => s.status === 'pending')?.name || 'Complete';
            return { ...m, steps: updatedSteps, progress, currentStep };
          }
          return m;
        })
      );
    }

    if (action === 'reject-step' && stepId) {
      setMerchants(prev =>
        prev.map(m => {
          if (m.id === merchantId) {
            const updatedSteps = m.steps.map(s =>
              s.id === stepId ? { ...s, status: 'rejected' as StepStatus } : s
            );
            return { ...m, steps: updatedSteps };
          }
          return m;
        })
      );
    }

    if (action === 'final-approve') {
      console.log(`Merchant ${merchantId} fully approved and activated!`);
      setMerchants(prev => prev.filter(m => m.id !== merchantId));
    }
  };

  return (
    <div className="flex-1 min-h-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Merchant Onboarding</h1>
        <p className="text-gray-600">Track and approve new merchants step by step</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-blue-800">
          <Clock className="w-5 h-5" />
          <span className="font-medium">{merchants.length} merchants awaiting approval</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {merchants.map((merchant) => (
          <OnboardingMerchantCard
            key={merchant.id}
            merchant={merchant}
            onAction={handleAction}
          />
        ))}

        {merchants.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">All merchants have been processed</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}