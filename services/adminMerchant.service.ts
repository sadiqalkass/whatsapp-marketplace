import api from '@/lib/api';

interface Merchant {
  id: string;
  businessName: string;
  category: string;
  location: string;
  phone: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  user: {
    email: string;
    name: string | null;
    createdAt: string;
  };
  verification: {
    governmentIdUrl: string;
    businessLicenseUrl: string | null;
    productSampleUrl: string;
    businessAddress: string;
    registrationNumber: string | null;
    idVerificationStatus: string;
    locationVerificationStatus: string;
    productSampleStatus: string;
    businessLicenseStatus: string | null;
    registrationNumberStatus: string | null;
    idVerifiedAt: string | null;
    locationVerifiedAt: string | null;
    productSampleVerifiedAt: string | null;
    businessLicenseVerifiedAt: string | null; 
    registrationNumberVerifiedAt: string | null; 
    idRejectionReason: string | null;
    locationRejectionReason: string | null;
    productRejectionReason: string | null;
    businessLicenseRejectionReason: string | null; 
    registrationNumberRejectionReason: string | null; 
    };
  createdAt: string;
}

export const adminMerchantService = {
  // Get pending merchants
  getPendingMerchants: async () => {
    const response = await api.get<{ success: boolean; data: Merchant[] }>(
      '/admin/merchants/pending'
    );
    return response.data;
  },

  // Get all merchants (with optional status filter)
  getAllMerchants: async (status?: 'PENDING' | 'VERIFIED' | 'REJECTED') => {
    const url = status 
      ? `/admin/merchants?status=${status}` 
      : '/admin/merchants';
    const response = await api.get<{ success: boolean; data: Merchant[] }>(url);
    return response.data;
  },

  // Get merchant details
  getMerchantDetails: async (merchantId: string) => {
    const response = await api.get<{ success: boolean; data: Merchant }>(
      `/admin/merchants/${merchantId}`
    );
    return response.data;
  },

  // Approve step
  approveStep: async (merchantId: string, step: string) => {
    const response = await api.patch(
      `/admin/merchants/${merchantId}/approve/${step}`
    );
    return response.data;
  },

  // Reject step
  rejectStep: async (merchantId: string, step: string, rejectionReason: string) => {
    const response = await api.patch(
      `/admin/merchants/${merchantId}/reject/${step}`,
      { rejectionReason }
    );
    return response.data;
  },

  // Suspend merchant
  suspendMerchant: async (merchantId: string) => {
    const response = await api.patch(`/admin/merchants/${merchantId}/suspend`);
    return response.data;
  },

  // Activate merchant
  activateMerchant: async (merchantId: string) => {
    const response = await api.patch(`/admin/merchants/${merchantId}/activate`);
    return response.data;
  },
};