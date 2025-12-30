import React, { useState } from 'react';
import { CheckCircle, Clock, Edit2 } from 'lucide-react';

type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

interface VerificationSectionProps {
  verificationStatus?: VerificationStatus;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function VerificationSection({ verificationStatus, onSubmit }: VerificationSectionProps) {
  const [isEditingVerification, setIsEditingVerification] = useState(true);
  const [governmentId, setGovernmentId] = useState<File | null>(null);
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [productSample, setProductSample] = useState<File | null>(null);
  const [businessAddress, setBusinessAddress] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  const getVerificationConfig = (status: VerificationStatus) => {
    if (status === 'VERIFIED') {
      return {
        label: 'Verified',
        color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
        icon: CheckCircle
      };
    }
    return {
      label: 'Pending Verification',
      color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
      icon: Clock
    };
  };

  const verificationConfig = verificationStatus 
    ? getVerificationConfig(verificationStatus)
    : null;
  const VerificationIcon = verificationConfig?.icon;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File too large. Max 5MB');
        return;
      }
      setter(file);
    }
  };

  const handleVerificationSubmit = async () => {
    if (!governmentId || !productSample || !businessAddress.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('governmentId', governmentId);
    formData.append('productSample', productSample);
    formData.append('businessAddress', businessAddress);

    if (registrationNumber) formData.append('registrationNumber', registrationNumber);
    if (businessLicense) formData.append('businessLicense', businessLicense);

    await onSubmit(formData);
    setIsEditingVerification(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <CheckCircle size={20} className="text-gray-400" />
          Account Verification
        </h2>
        {!isEditingVerification && verificationStatus !== 'VERIFIED' && (
          <button
            onClick={() => setIsEditingVerification(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Edit2 size={16} />
            Edit Verification Details
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Current Status */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between">
            {verificationConfig && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Verification Status
                </p>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full ${verificationConfig.color}`}>
                  <verificationConfig.icon size={16} />
                  {verificationConfig.label}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Business Registration Number - Optional */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Business Registration Number <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="e.g., RC123456"
            disabled={verificationStatus === 'VERIFIED' || !isEditingVerification}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Government ID Upload - Required */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Government-Issued ID <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              id="government-id"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange(e, setGovernmentId)}
              disabled={verificationStatus === 'VERIFIED' || !isEditingVerification}
              className="hidden"
            />
            <label
              htmlFor="government-id"
              className={`cursor-pointer ${verificationStatus === 'VERIFIED' || !isEditingVerification ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {governmentId ? `✓ Selected: ${governmentId.name}` : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                PNG, JPG or PDF (max. 5MB)
              </p>
            </label>
          </div>
        </div>

        {/* Business License/Certificate Upload - Optional */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Business License/Certificate <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              id="business-license"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange(e, setBusinessLicense)}
              disabled={verificationStatus === 'VERIFIED' || !isEditingVerification}
              className="hidden"
            />
            <label
              htmlFor="business-license"
              className={`cursor-pointer ${verificationStatus === 'VERIFIED' || !isEditingVerification ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {businessLicense ? `✓ Selected: ${businessLicense.name}` : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                PNG, JPG or PDF (max. 5MB)
              </p>
            </label>
          </div>
        </div>

        {/* Product Sample Upload - Required */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product Sample <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Upload a clear photo of one of your products for review
          </p>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              id="product-sample"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setProductSample)}
              disabled={verificationStatus === 'VERIFIED' || !isEditingVerification}
              className="hidden"
            />
            <label
              htmlFor="product-sample"
              className={`cursor-pointer ${verificationStatus === 'VERIFIED' || !isEditingVerification ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {productSample ? `✓ Selected: ${productSample.name}` : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                PNG or JPG (max. 5MB)
              </p>
            </label>
          </div>
        </div>

        {/* Location Confirmation - Required */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Business Address <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            placeholder="Enter your complete business address"
            disabled={verificationStatus === 'VERIFIED' || !isEditingVerification}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Action Buttons */}
        {isEditingVerification && verificationStatus !== 'VERIFIED' && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleVerificationSubmit}
              className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Submit for Verification
            </button>
            <button
              onClick={() => setIsEditingVerification(false)}
              className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}