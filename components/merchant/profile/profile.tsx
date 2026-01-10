'use client';

import React, { useState, useEffect } from 'react';
import { Lock, LogOut } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { profileService } from '@/services/profile.service';
import ProfileHeader from '@/components/merchant/profile/profileHeader';
import BusinessInfoSection from '@/components/merchant/profile/BusinessInfoSection';
import ContactDetailsSection from '@/components/merchant/profile/ContactDetailsSection';
import VerificationSection from '@/components/merchant/profile/VerificationSection';
import toast from 'react-hot-toast';

type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

interface MerchantProfileData {
  businessName: string;
  category: string;
  location: string;
  phone: string;
  profilePictureUrl: string;
  verificationStatus?: VerificationStatus;
  user?: {
    email: string;
  };
}

export default function MerchantProfilePage() {
  const [loading, setLoading] = useState(true);
  const [realProfile, setRealProfile] = useState<MerchantProfileData | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('/default-avatar.png');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Fetch merchant profile
  const fetchProfile = async () => {
    try {
      const response = await profileService.getMerchantProfile();
      setRealProfile(response.data);

      if (response.data?.profilePictureUrl) {
        setProfilePictureUrl(response.data.profilePictureUrl);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleBusinessInfoUpdate = async (data: { businessName: string; category: string; location: string }) => {
    try {
      await profileService.updateMerchantProfile({
        ...data,
        phone: realProfile?.phone || ''
      });
      fetchProfile();
      toast.error('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      atoast.error(errorMessage);
      throw error;
    }
  };

  const handlePhoneUpdate = async (phone: string) => {
    try {
      if (!realProfile?.businessName || !realProfile?.category || !realProfile?.location) {
        toast.error('Please fill in business information first');
        return;
      }

      await profileService.updateMerchantProfile({
        businessName: realProfile.businessName,
        category: realProfile.category,
        location: realProfile.location,
        phone
      });
      fetchProfile();
      toast.error('Phone number updated successfully!');
    } catch (error) {
      console.error('Error updating phone:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update phone';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleProfilePictureChange = (file: File, previewUrl: string) => {
    setProfilePicture(file);
    setProfilePictureUrl(previewUrl);
  };

 const handleVerificationSubmit = async (formData: FormData) => {
    if (!realProfile?.businessName || !realProfile?.category || !realProfile?.location) {
      toast.error('Please complete your business information first');
      return;
    }

    formData.append('businessName', realProfile.businessName);
    formData.append('category', realProfile.category);
    formData.append('location', realProfile.location);
    formData.append('phone', realProfile.phone || '');

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      await profileService.submitMerchantVerification(formData);
      toast.error('Verification submitted successfully');
      fetchProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error submitting verification');
      console.error(error);
      throw error;
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');

    try {
      await profileService.changeMerchantPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      toast.error('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const hasSubmittedVerification = realProfile?.verificationStatus !== undefined !== null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <ProfileHeader
        verificationStatus={realProfile?.verificationStatus as VerificationStatus | undefined}
        hasSubmittedVerification={hasSubmittedVerification}
      />

      <BusinessInfoSection
        businessName={realProfile?.businessName || ''}
        category={realProfile?.category || ''}
        location={realProfile?.location || ''}
        profilePictureUrl={profilePictureUrl}
        onUpdate={handleBusinessInfoUpdate}
        onProfilePictureChange={handleProfilePictureChange}
      />

      <ContactDetailsSection
        email={realProfile?.user?.email || ''}
        phone={realProfile?.phone || ''}
        onUpdatePhone={handlePhoneUpdate}
      />

      <VerificationSection
        verificationStatus={realProfile?.verificationStatus}
        onSubmit={handleVerificationSubmit}
      />

      {/* Security Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock size={20} className="text-gray-400" />
            Security
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Password
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last changed 30 days ago
              </p>
            </div>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              Change Password
            </button>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to logout? You will be redirected to the login page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => authService.logout()}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Change Password
            </h3>

            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePasswordChange}
                disabled={passwordLoading}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                }}
                disabled={passwordLoading}
                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}