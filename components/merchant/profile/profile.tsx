'use client';

import React, { useState, useEffect } from 'react';
import { User, MapPin, Mail, Phone, Building2, Tag, Lock, CheckCircle, Clock, Edit2, LogOut } from 'lucide-react';
import { MerchantProfile } from '@/Types/types';
import Image from 'next/image';
import { authService } from '@/services/auth.service';
import { profileService } from '@/services/profile.service';

type VerificationStatus = 'Pending' | 'Verified';

export default function MerchantProfilePage() {
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileService.getMerchantProfile();
      setRealProfile(response.data);
      
      // Update form if profile exists
      if (response.data) {
        setEditedProfile({
          businessName: response.data.businessName || '',
          category: response.data.category || '',
          location: response.data.location || '',
          email: response.data.user?.email || '',
          phone: response.data.phone || '',
          verificationStatus: response.data.verificationStatus || 'Pending'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [realProfile, setRealProfile] = useState<any>(null);

  const [editedProfile, setEditedProfile] = useState<MerchantProfile>({
    businessName: '',
    category: '',
    location: '',
    email: '',
    phone: '',
    verificationStatus: 'Pending'
  });

  const handleEdit = () => {
    setIsEditing(true);
    if (realProfile) {
      setEditedProfile({
        businessName: realProfile.businessName || '',
        category: realProfile.category || '',
        location: realProfile.location || '',
        email: realProfile.user?.email || '',
        phone: realProfile.phone || '',
        verificationStatus: realProfile.verificationStatus || 'Pending'
      });
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    fetchProfile(); 
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (realProfile) {
      setEditedProfile({
        businessName: realProfile.businessName || '',
        category: realProfile.category || '',
        location: realProfile.location || '',
        email: realProfile.user?.email || '',
        phone: realProfile.phone || '',
        verificationStatus: realProfile.verificationStatus || 'Pending'
      });
    }
  };

  const handleInputChange = (field: keyof MerchantProfile, value: string) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const getVerificationConfig = (status: VerificationStatus) => {
    if (status === 'Verified') {
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

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('/default-avatar.png');

  const verificationConfig = getVerificationConfig(
    realProfile?.verificationStatus === 'VERIFIED' ? 'Verified' : 'Pending'
  );
  const VerificationIcon = verificationConfig.icon;
  const [governmentId, setGovernmentId] = useState<File | null>(null);
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [productSample, setProductSample] = useState<File | null>(null);
  const [businessAddress, setBusinessAddress] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [isEditingVerification, setIsEditingVerification] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordChange = async () => {
    // Validation
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

      alert('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleVerificationSubmit = async () => {
    // validate required fields
    if (!governmentId || !productSample || !businessAddress.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('businessName', realProfile?.businessName || '');
    formData.append('category', realProfile?.category || '');
    formData.append('location', realProfile?.location || '');
    formData.append('phone', realProfile?.phone || '');
    formData.append('governmentId', governmentId);
    formData.append('productSample', productSample);
    formData.append('businessAddress', businessAddress);

    if (profilePicture) formData.append('profilePicture', profilePicture);
    if (registrationNumber) formData.append('registrationNumber', registrationNumber);
    if (businessLicense) formData.append('businessLicense', businessLicense);

    try {
      const response = await fetch('/api/merchant/verification', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert('Verificaation submitted successfully');
        fetchProfile();
      } else {
        alert(data.message || 'Submission failed');
      }
    } catch (error) {
      alert('Error submitting verification');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
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
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full ${verificationConfig.color}`}>
            <VerificationIcon size={16} />
            {verificationConfig.label}
          </span>
        </div>
      </div>

      {/* Profile Picture */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex items-center gap-6">
            <Image
              src={profilePictureUrl}
              alt="Profile"
              fill
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      alert('File too large. Max 5MB');
                      return;
                    }
                    setProfilePicture(file);
                    setProfilePictureUrl(URL.createObjectURL(file));
                  }
                }}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 size={20} className="text-gray-400" />
            Business Information
          </h2>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={isEditing ? editedProfile.businessName : realProfile?.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  disabled={realProfile?.verificationStatus === 'Verified' || !isEditingVerification}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <div className="relative">
                <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={isEditing ? editedProfile.category : realProfile?.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  disabled={realProfile?.verificationStatus === 'Verified' || !isEditingVerification}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={isEditing ? editedProfile.location : realProfile?.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={realProfile?.verificationStatus === 'Verified' || !isEditingVerification}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Mail size={20} className="text-gray-400" />
            Contact Details
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={isEditing ? editedProfile.email : realProfile?.user?.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={realProfile?.verificationStatus === 'Verified' || !isEditingVerification}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={isEditing ? editedProfile.phone : realProfile?.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={realProfile?.verificationStatus === 'Verified' || !isEditingVerification}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

     {/* Verification Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle size={20} className="text-gray-400" />
            Account Verification
          </h2>
          {isEditingVerification && realProfile?.verificationStatus !== 'Verified' && (
            <button
              onClick={() => setIsEditingVerification(true)}
              className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors'
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
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Verification Status
                </p>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full ${verificationConfig.color}`}>
                  <VerificationIcon size={16} />
                  {verificationConfig.label}
                </span>
              </div>
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
              disabled={realProfile?.verificationStatus === 'VERIFIED' || !isEditingVerification}
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
                onChange={(e) => setGovernmentId(e.target.files?.[0] || null)}
                disabled={realProfile?.verificationStatus === 'Verified' || !isEditingVerification}
                className="hidden"
              />
              <label
                htmlFor="government-id"
                className={`cursor-pointer ${realProfile?.verificationStatus === 'Verified' || !isEditingVerification ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload or drag and drop
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
                onChange={(e) => setBusinessLicense(e.target.files?.[0] || null)}
                disabled={realProfile?.verificationStatus === 'Verified' || !isEditingVerification}
                className="hidden"
              />
              <label
                htmlFor="business-license"
                className={`cursor-pointer ${realProfile?.verificationStatus === 'Verified' || !isEditingVerification ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload or drag and drop
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
                onChange={(e) => setProductSample(e.target.files?.[0] || null)}
                disabled={realProfile?.verificationStatus === 'Verified' || !isEditingVerification}
                className="hidden"
              />
              <label
                htmlFor="product-sample"
                className={`cursor-pointer ${realProfile?.verificationStatus === 'Verified' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload or drag and drop
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
              disabled={realProfile?.verificationStatus === 'Verified'}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          {realProfile?.verificationStatus !== 'Verified' && (
            <button
              onClick={handleVerificationSubmit}
              className="w-full px-6 py-3 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Submit for Verification
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {isEditingVerification && realProfile?.verificationStatus !== 'Verified' && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
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

      {/* Change Password & Logout */}
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

          {/* ADD LOGOUT BUTTON */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
      {/* Logout Confirmation Modal */}
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