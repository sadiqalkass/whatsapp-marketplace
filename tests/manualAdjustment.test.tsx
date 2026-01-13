import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { ManualAdjustmentModal } from '@/components/admin/finance/Wallet';
import { walletService } from '@/services/wallet.service';

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/services/wallet.service', async () => {
  const actual = await vi.importActual<any>('@/services/wallet.service');
  return {
    ...actual,
    walletService: {
      ...actual.walletService,
      adjustMerchantBalance: vi.fn(),
    }
  };
});

const mockWallet = { id: '1', merchantId: 'm1', merchantName: 'Merchant', phone: '0801', email: 'a@b.com', balance: 1000, totalEarnings: 0, totalWithdrawals: 0, transactionCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

describe('ManualAdjustmentModal', () => {
  beforeEach(() => {
    (walletService.adjustMerchantBalance as any).mockReset();
  });

  it('submits adjustment', async () => {
    (walletService.adjustMerchantBalance as any).mockResolvedValue({ success: true });

    const handleClose = vi.fn();
    render(<ManualAdjustmentModal wallet={mockWallet as any} onClose={handleClose} /> as any);

    const amountInput = screen.getByLabelText(/Amount/i) as HTMLInputElement;
    fireEvent.change(amountInput, { target: { value: '500' } });

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtn);

    await waitFor(() => expect(walletService.adjustMerchantBalance).toHaveBeenCalledWith('m1', { amount: 500, reason: '' }));
  });
});