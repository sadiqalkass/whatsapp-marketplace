'use client';

import React, { useState } from 'react';
import { User, MapPin, Mail, Phone, Building2, Tag, Lock, CheckCircle, Clock, Edit2 } from 'lucide-react';
import { MerchantProfile } from '@/Types/types';
import Image from 'next/image';

type VerificationStatus = 'Pending' | 'Verified';

export default function MerchantProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<MerchantProfile>({
    businessName: 'TechHub Electronics',
    category: 'Electronics & Gadgets',
    location: 'Lagos, Nigeria',
    email: 'techhub@email.com',
    phone: '+234 801 234 5678',
    verificationStatus: 'Verified'
  });

  const [editedProfile, setEditedProfile] = useState<MerchantProfile>(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
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

  const verificationConfig = getVerificationConfig(profile.verificationStatus);
  const VerificationIcon = verificationConfig.icon;
  const [governmentId, setGovernmentId] = useState<File | null>(null);
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [productSample, setProductSample] = useState<File | null>(null);
  const [businessAddress, setBusinessAddress] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [isEditingVerification, setIsEditingVerification] = useState(true);

  const handleVerificationSubmit = async () => {
    // validate required fields
    if (!governmentId || !productSample || !businessAddress.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('businessName', profile.businessName);
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
        setProfile({...profile, verificationStatus: 'Pending'});
      } else {
        alert(data.message || 'Submission failed');
      }
    } catch (error) {
      alert('Error submitting verification');
      console.error(error);
    }
  };

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
                  value={isEditing ? editedProfile.businessName : profile.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  disabled={profile.verificationStatus === 'Verified' || !isEditingVerification}
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
                  value={isEditing ? editedProfile.category : profile.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  disabled={profile.verificationStatus === 'Verified' || !isEditingVerification}
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
                  value={isEditing ? editedProfile.location : profile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={profile.verificationStatus === 'Verified' || !isEditingVerification}
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
                  value={isEditing ? editedProfile.email : profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={profile.verificationStatus === 'Verified' || !isEditingVerification}
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
                  value={isEditing ? editedProfile.phone : profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={profile.verificationStatus === 'Verified' || !isEditingVerification}
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
          {isEditingVerification && profile.verificationStatus !== 'Verified' && (
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
              disabled={profile.verificationStatus === 'Verified' || !isEditingVerification}
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
                disabled={profile.verificationStatus === 'Verified' || !isEditingVerification}
                className="hidden"
              />
              <label
                htmlFor="government-id"
                className={`cursor-pointer ${profile.verificationStatus === 'Verified' || !isEditingVerification ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                disabled={profile.verificationStatus === 'Verified' || !isEditingVerification}
                className="hidden"
              />
              <label
                htmlFor="business-license"
                className={`cursor-pointer ${profile.verificationStatus === 'Verified' || !isEditingVerification ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                disabled={profile.verificationStatus === 'Verified' || !isEditingVerification}
                className="hidden"
              />
              <label
                htmlFor="product-sample"
                className={`cursor-pointer ${profile.verificationStatus === 'Verified' ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              disabled={profile.verificationStatus === 'Verified'}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          {profile.verificationStatus !== 'Verified' && (
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
      {isEditingVerification && profile.verificationStatus !== 'Verified' && (
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

      {/* Change Password */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock size={20} className="text-gray-400" />
            Security
          </h2>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Password
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last changed 30 days ago
              </p>
            </div>
            <button className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}