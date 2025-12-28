import api from '@/lib/api';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface UpdatePreferencesData {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

interface Toggle2FAData {
  enabled: boolean;
}

export const profileService = {
  // Admin profile
  getAdminProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },

  updateAdminPreferences: async (data: UpdatePreferencesData) => {
    const response = await api.patch('/admin/profile/preferences', data);
    return response.data;
  },

  changeAdminPassword: async (data: ChangePasswordData) => {
    const response = await api.patch('/admin/profile/password', data);
    return response.data;
  },

  toggleAdmin2FA: async (data: Toggle2FAData) => {
    const response = await api.patch('/admin/profile/2fa', data);
    return response.data;
  },

  // Merchant profile
  getMerchantProfile: async () => {
    const response = await api.get('/merchant/profile');
    return response.data;
  },

  changeMerchantPassword: async (data: ChangePasswordData) => {
    const response = await api.patch('/merchant/password', data);
    return response.data;
  },
};