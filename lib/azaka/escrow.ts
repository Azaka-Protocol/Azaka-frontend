import { getAzakaClient } from './client';
import { Escrow } from './types';

export const depositEscrow = async (
  tradeId: string,
  amount: string,
  asset: string
): Promise<string> => {
  const client = getAzakaClient();
  
  console.log('Depositing escrow for trade:', tradeId, 'amount:', amount, asset);
  
  // Simulate transaction
  return 'mock-deposit-tx-' + Date.now();
};

export const getEscrow = async (tradeId: string): Promise<Escrow | null> => {
  const client = getAzakaClient();
  
  console.log('Fetching escrow for trade:', tradeId);
  
  // Mock data
  const mockEscrow: Escrow = {
    tradeId,
    amount: '50000.00',
    asset: 'USDC',
    depositor: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    depositedAt: Date.now() - 86400000 * 4,
    released: false,
  };
  
  return mockEscrow;
};

export const releaseEscrow = async (tradeId: string): Promise<string> => {
  const client = getAzakaClient();
  
  console.log('Releasing escrow for trade:', tradeId);
  
  // Simulate transaction
  return 'mock-release-tx-' + Date.now();
};

export const refundEscrow = async (tradeId: string): Promise<string> => {
  const client = getAzakaClient();
  
  console.log('Refunding escrow for trade:', tradeId);
  
  // Simulate transaction
  return 'mock-refund-tx-' + Date.now();
};

export const checkReleaseConditions = async (tradeId: string): Promise<{
  canRelease: boolean;
  documentsVerified: number;
  documentsRequired: number;
}> => {
  const client = getAzakaClient();
  
  console.log('Checking release conditions for trade:', tradeId);
  
  // Mock data
  return {
    canRelease: false,
    documentsVerified: 2,
    documentsRequired: 3,
  };
};
