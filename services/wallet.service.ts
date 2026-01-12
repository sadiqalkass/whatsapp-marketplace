import api from '@/lib/api';

export interface WalletData {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  totalWithdrawals: number;
  recentTransactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  reference: string;
  description: string;
  createdAt: string;
  metadata?: any;
}

export interface WithdrawalRequest {
  amount: number;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
}

export interface PlatformRevenue {
  totalRevenue: number;
  totalPayouts: number;
  currentBalance: number;
}

class WalletService {
  // Merchant endpoints
  async getMerchantDashboard(merchantId: string): Promise<WalletData> {
    const response = await api.get(`/wallet/merchant/${merchantId}/dashboard`);
    return response.data.data;
  }

  async getMerchantTransactions(merchantId: string, limit = 50): Promise<Transaction[]> {
    const response = await api.get(`/wallet/merchant/${merchantId}/transactions?limit=${limit}`);
    return response.data.data;
  }

  async requestWithdrawal(merchantId: string, data: WithdrawalRequest) {
    const response = await api.post(`/wallet/merchant/${merchantId}/withdraw`, data);
    return response.data;
  }

  // Platform endpoints
  async getPlatformRevenue(): Promise<PlatformRevenue> {
    const response = await api.get('/wallet/platform/revenue');
    return response.data.data;
  }

  async withdrawFromPlatform(data: WithdrawalRequest) {
    const response = await api.post('/wallet/platform/withdraw', data);
    return response.data;
  }
}

export const walletService = new WalletService();