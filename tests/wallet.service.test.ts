import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '@/lib/api';
import { walletService } from '@/services/wallet.service';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

const mockTxn = { id: 't1', type: 'DEPOSIT', amount: 1000, balanceAfter: 1000, reference: 'REF1', description: 'test', createdAt: new Date().toISOString() };

describe('wallet.service', () => {
  beforeEach(() => {
    (api.get as any).mockReset();
    (api.post as any).mockReset();
  });

  it('getPlatformTransactions returns transactions', async () => {
    (api.get as any).mockResolvedValue({ data: { data: [mockTxn] } });
    const data = await walletService.getPlatformTransactions(5);
    expect(api.get).toHaveBeenCalledWith('/wallet/platform/transactions?limit=5');
    expect(data).toEqual([mockTxn]);
  });

  it('adjustMerchantBalance posts adjustment', async () => {
    (api.post as any).mockResolvedValue({ data: { success: true } });
    const res = await walletService.adjustMerchantBalance('merchant123', { amount: 500, reason: 'test' });
    expect(api.post).toHaveBeenCalledWith('/wallet/merchant/merchant123/adjust', { amount: 500, reason: 'test' });
    expect(res).toEqual({ success: true });
  });
});