import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

interface ProfileHeaderProps {
  verificationStatus?: VerificationStatus;
  hasSubmittedVerification: boolean;
}

export default function ProfileHeader({ verificationStatus, hasSubmittedVerification }: ProfileHeaderProps) {
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

  const verificationConfig = verificationStatus ? getVerificationConfig(verificationStatus) : null;
  const VerificationIcon = verificationConfig?.icon;

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information
          </p>
        </div>
        {hasSubmittedVerification && verificationConfig && (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full ${verificationConfig.color}`}>
            <VerificationIcon size={16} />
            {verificationConfig.label}
          </span>
        )}
      </div>
    </div>
  );
}