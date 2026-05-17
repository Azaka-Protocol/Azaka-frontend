import { getAzakaClient } from './client';
import { Escrow } from './types';

export const depositEscrow = async (
  _tradeId: string,
  _amount: string,
  _asset: string
): Promise<string> => {
  getAzakaClient();

  // Simulate transaction
  return 'mock-deposit-tx-' + Date.now();
};

export const getEscrow = async (_tradeId: string): Promise<Escrow | null> => {
  getAzakaClient();

  // Mock data
  const mockEscrow: Escrow = {
    tradeId: _tradeId,
    amount: '50000.00',
    asset: 'USDC',
    depositor: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    depositedAt: Date.now() - 86400000 * 4,
    released: false,
  };

  return mockEscrow;
};

export const releaseEscrow = async (_tradeId: string): Promise<string> => {
  getAzakaClient();

  // Simulate transaction
  return 'mock-release-tx-' + Date.now();
};

export const refundEscrow = async (_tradeId: string): Promise<string> => {
  getAzakaClient();

  // Simulate transaction
  return 'mock-refund-tx-' + Date.now();
};

export const checkReleaseConditions = async (
  _tradeId: string
): Promise<{
  canRelease: boolean;
  documentsVerified: number;
  documentsRequired: number;
}> => {
  getAzakaClient();

  // Mock data
  return {
    canRelease: false,
    documentsVerified: 2,
    documentsRequired: 3,
  };
};
