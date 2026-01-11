import api from '@/lib/api';

interface RegisterData {
  email: string;
  password: string;
  role?: 'MERCHANT' | 'ADMIN' | 'MANAGER' | 'SUPPORT';
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      role: string;
    };
    token: string;
  };
}

type User = AuthResponse['data']['user'];

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  saveAuth: (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  riderRegister: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    vehicleType: string;
    vehicleNumber?: string;
    licensePlate?: string;
  }) => {
    const response = await api.post<AuthResponse>('/auth/rider/register', data);
    return response.data;
  },
};