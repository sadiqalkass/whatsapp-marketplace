'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, FileText, MapPin, Package, ChevronDown, ChevronUp, ExternalLink, FileImage } from 'lucide-react';
import { adminMerchantService } from '@/services/adminMerchant.service';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type StepStatus = 'pending' | 'approved' | 'rejected';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface OnboardingStep {
  id: string;
  name: string;
  status: StepStatus;
  icon: IconType;
  completedDate?: string;
  notes?: string;
  documentUrl?: string;
}

interface OnboardingMerchant {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  location: string;
  appliedDate: string;
  currentStep: string;
  progress: number;
  steps: OnboardingStep[];
  businessAddress: string;
  registrationNumber?: string;
}

interface Merchant {
  id: string;
  businessName: string;
  category: string;
  verification: {
    idVerificationStatus: string;
    locationVerificationStatus: string;
    productSampleStatus: string;
    businessLicenseStatus: string | null;
    businessLicenseUrl: string | null;
    governmentIdUrl: string;
    productSampleUrl: string;
    businessAddress: string;
    registrationNumber: string | null;
    idVerifiedAt: string | null;
    locationVerifiedAt: string | null;
    productSampleVerifiedAt: string | null;
    businessLicenseVerifiedAt: string | null;
    idRejectionReason: string | null;
    locationRejectionReason: string | null;
    productRejectionReason: string | null;
    businessLicenseRejectionReason: string | null;
  };
  createdAt: string;
  user: {
    email: string;
  };
  phone: string;
  location: string;
}

const StepStatusIcon = ({ status }: { status: StepStatus }) => {
  if (status === 'approved') {
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  }
  if (status === 'rejected') {
    return <XCircle className="w-5 h-5 text-red-600" />;
  }
  return <Clock className="w-5 h-5 text-yellow-600" />;
};

const DocumentViewer = ({ url, onClose }: { url: string; onClose: () => void }) => {
  const isPDF = url.toLowerCase().endsWith('.pdf');
  const fullUrl = `http://localhost:5000/${url}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Document Preview</h3>
          <div className="flex gap-2">
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              Open Full
            </a>
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {isPDF ? (
            <iframe src={fullUrl} className="w-full h-full min-h-[600px]" />
          ) : (
            <img src={fullUrl} alt="Document" className="max-w-full h-auto mx-auto" />
          )}
        </div>
      </div>
    </div>
  );
};

const OnboardingMerchantCard = ({ 
  merchant, 
  onAction,
  onRefresh 
}: { 
  merchant: OnboardingMerchant; 
  onAction: (action: string, merchantId: string, stepId?: string, reason?: string) => void;
  onRefresh: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReject = async (stepId: string) => {
    if (rejectReason.trim()) {
      setLoading(true);
      await onAction('reject-step', merchant.id, stepId, rejectReason);
      setShowRejectModal(null);
      setRejectReason('');
      setLoading(false);
      onRefresh();
    }
  };

  const handleApprove = async (stepId: string) => {
    setLoading(true);
    await onAction('approve-step', merchant.id, stepId);
    setLoading(false);
    onRefresh();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{merchant.name}</h3>
            <p className="text-sm text-gray-600">{merchant.category}</p>
            <p className="text-xs text-gray-500 mt-1">{merchant.email}</p>
            <p className="text-xs text-gray-500">Applied: {merchant.appliedDate}</p>
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
            {/* Business Details */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm text-gray-900">Business Details</h4>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Phone:</span> {merchant.phone}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Location:</span> {merchant.location}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Address:</span> {merchant.businessAddress}
              </p>
              {merchant.registrationNumber && (
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Reg Number:</span> {merchant.registrationNumber}
                </p>
              )}
            </div>

            {/* Verification Steps */}
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
                  <p className="text-sm text-gray-600 mb-2">
                    {step.status === 'approved' && `Completed on ${step.completedDate}`}
                    {step.status === 'pending' && 'Awaiting review'}
                    {step.status === 'rejected' && step.notes}
                  </p>
                  
                  {/* View Document Button */}
                  {step.documentUrl && (
                    <button
                      onClick={() => setViewingDocument(step.documentUrl!)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mb-2"
                    >
                      <FileImage className="w-3 h-3" />
                      View Document
                    </button>
                  )}

                  {step.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleApprove(step.id)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Approve Step'}
                      </button>
                      <button
                        onClick={() => setShowRejectModal(step.id)}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
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
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">
                    All steps approved! Merchant is now active.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reject Modal */}
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
                disabled={!rejectReason.trim() || loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer */}
      {viewingDocument && (
        <DocumentViewer
          url={viewingDocument}
          onClose={() => setViewingDocument(null)}
        />
      )}
    </div>
  );
};

export default function OnboardingPage() {
  const [merchants, setMerchants] = useState<OnboardingMerchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  console.log('component render - loading:', loading, 'merchants:', merchants.length)

  const router = useRouter();

  useEffect(() => {
    console.log('useEffect running')
    fetchPendingMerchants();
  }, [])

  const fetchPendingMerchants = async () => {
    try {
      console.log('Fetching merchants...')
      setLoading(true);
      setError('');
      const response = await adminMerchantService.getPendingMerchants();

      console.log('Response:', response);

      const transformedMerchants = response.data.map(m => {
        const steps: OnboardingStep[] = [
          {
            id: 'id-verify',
            name: 'ID Verification',
            status: mapStatus(m.verification.idVerificationStatus),
            icon: FileText,
            completedDate: m.verification.idVerifiedAt 
              ? new Date(m.verification.idVerifiedAt).toISOString().split('T')[0] 
              : undefined,
            notes: m.verification.idRejectionReason || undefined,
            documentUrl: m.verification.governmentIdUrl,
          },
          {
            id: 'location-verify',
            name: 'Location Verification',
            status: mapStatus(m.verification.locationVerificationStatus),
            icon: MapPin,
            completedDate: m.verification.locationVerifiedAt
              ? new Date(m.verification.locationVerifiedAt).toISOString().split('T')[0]
              : undefined,
            notes: m.verification.locationRejectionReason || undefined,
          },
          {
            id: 'product-sample',
            name: 'Product Sample Review',
            status: mapStatus(m.verification.productSampleStatus),
            icon: Package,
            completedDate: m.verification.productSampleVerifiedAt
              ? new Date(m.verification.productSampleVerifiedAt).toISOString().split('T')[0]
              : undefined,
            notes: m.verification.productRejectionReason || undefined,
            documentUrl: m.verification.productSampleUrl,
          },
        ];

        // Add optional steps if provided
        if (m.verification.businessLicenseUrl) {
          steps.push({
            id: 'business-license',
            name: 'Business License',
            status: mapStatus(m.verification.businessLicenseStatus || 'PENDING'),
            icon: FileText,
            completedDate: m.verification.businessLicenseVerifiedAt
              ? new Date(m.verification.businessLicenseVerifiedAt).toISOString().split('T')[0]
              : undefined,
            notes: m.verification.businessLicenseRejectionReason || undefined,
            documentUrl: m.verification.businessLicenseUrl,
          });
        }

        return {
          id: m.id,
          name: m.businessName,
          category: m.category,
          email: m.user.email,
          phone: m.phone,
          location: m.location,
          appliedDate: new Date(m.createdAt).toISOString().split('T')[0],
          currentStep: getCurrentStep(m.verification),
          progress: calculateProgress(m.verification),
          steps,
          businessAddress: m.verification.businessAddress,
          registrationNumber: m.verification.registrationNumber || undefined,
        };
      });

      setMerchants(transformedMerchants);
      console.log('Transformed:', transformedMerchants);
      console.log('Count:', transformedMerchants.length);
      console.log('Loading State:', loading);
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Acess denied');
        router.push('/admin/dashboard');
      } else {
        toast.error('Failed to load pending Merchants');
      } 
      console.error('Failed to fetch pending merchants:', error);
    } finally {
      setLoading(false);
      console.log('Loading set to false');
    }
  };

  const mapStatus = (status: string): StepStatus => {
    if (status === 'VERIFIED') return 'approved';
    if (status === 'REJECTED') return 'rejected';
    return 'pending';
  };

  const getCurrentStep = (verification: Merchant['verification']) => {
    if (verification.idVerificationStatus === 'PENDING') return 'ID Verification';
    if (verification.locationVerificationStatus === 'PENDING') return 'Location Verification';
    if (verification.productSampleStatus === 'PENDING') return 'Product Sample Review';
    if (verification.businessLicenseUrl && verification.businessLicenseStatus === 'PENDING') 
      return 'Business License Review';
    return 'Complete';
  };

  const calculateProgress = (verification: Merchant['verification']) => {
    let completed = 0;
    const total = 3;

    if (verification.idVerificationStatus === 'VERIFIED') completed++;
    if (verification.locationVerificationStatus === 'VERIFIED') completed++;
    if (verification.productSampleStatus === 'VERIFIED') completed++;

    return Math.round((completed / total) * 100);
  };

  const handleAction = async (
    action: string, 
    merchantId: string, 
    stepId?: string, 
    reason?: string
  ) => {
    try {
      if (action === 'approve-step' && stepId) {
        const stepMap: Record<string, string> = {
          'id-verify': 'id',
          'location-verify': 'location',
          'product-sample': 'product',
          'business-license': 'businessLicense',
        };
        
        await adminMerchantService.approveStep(merchantId, stepMap[stepId]);
      }

      if (action === 'reject-step' && stepId && reason) {
        const stepMap: Record<string, string> = {
          'id-verify': 'id',
          'location-verify': 'location',
          'product-sample': 'product',
          'business-license': 'businessLicense',
        };

        await adminMerchantService.rejectStep(merchantId, stepMap[stepId], reason);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Action failed';
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
    }
  };

  if (loading) {
    console.log('Returning loading screen');
    return (
      <div className="flex-1 min-h-full flex items-center justify-center">
        <div className="text-gray-600">Loading merchants...</div>
      </div>
    );
  }

  console.log('Passed loading check')

  console.log('Rendering main UI');

  return (
    <div className="flex-1 min-h-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

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
              onRefresh={fetchPendingMerchants}
            />
          ))}

          {merchants.length === 0 && (
            <div className="col-span-full bg-white border border-gray-200 rounded-lg p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">All merchants have been processed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}