import { getAzakaClient } from './client';
import { Trade, ContractStatus, DocumentType } from './types';

export interface CreateTradeParams {
  importer: string;
  amount: string;
  asset: string;
  expiryDate: number;
  requiredDocuments: DocumentType[];
  issuingBank: string;
  confirmingBank?: string;
}

export const createTrade = async (params: CreateTradeParams): Promise<string> => {
  const client = getAzakaClient();
  
  // In production, this would call the Azaka SDK to create a trade
  // For now, we return a mock trade ID
  console.log('Creating trade with params:', params);
  
  // Simulate contract call
  const tradeId = `trade-${Date.now()}`;
  
  return tradeId;
};

export const getTrade = async (tradeId: string): Promise<Trade | null> => {
  const client = getAzakaClient();
  
  // In production, this would call the Azaka SDK to fetch trade data
  console.log('Fetching trade:', tradeId);
  
  // Mock data for development
  const mockTrade: Trade = {
    id: tradeId,
    exporter: 'GDZST3XVCDTUJ76ZAV2HA72KYQODXXZ5PTMAPZGDHZ6CS7RO7MGG3DBM',
    importer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    amount: '50000.00',
    asset: 'USDC',
    status: ContractStatus.Active,
    requiredDocuments: [
      DocumentType.BillOfLading,
      DocumentType.CertificateOfOrigin,
      DocumentType.InspectionCertificate,
    ],
    issuingBank: 'GCZYLNGU4CA5NAWBAVTHMZH4JKXPKR3NKDKZ7XQXQXQXQXQXQXQXQXQX',
    createdAt: Date.now() - 86400000 * 5, // 5 days ago
    expiryDate: Date.now() + 86400000 * 25, // 25 days from now
  };
  
  return mockTrade;
};

export const getTradesByParticipant = async (
  address: string,
  role?: 'exporter' | 'importer' | 'bank'
): Promise<Trade[]> => {
  const client = getAzakaClient();
  
  // In production, this would call the Azaka SDK to fetch trades
  console.log('Fetching trades for participant:', address, 'role:', role);
  
  // Mock data for development
  const mockTrades: Trade[] = [
    {
      id: 'trade-001',
      exporter: address,
      importer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      amount: '50000.00',
      asset: 'USDC',
      status: ContractStatus.Active,
      requiredDocuments: [DocumentType.BillOfLading, DocumentType.CertificateOfOrigin],
      issuingBank: 'GCZYLNGU4CA5NAWBAVTHMZH4JKXPKR3NKDKZ7XQXQXQXQXQXQXQXQXQX',
      createdAt: Date.now() - 86400000 * 5,
      expiryDate: Date.now() + 86400000 * 25,
    },
    {
      id: 'trade-002',
      exporter: address,
      importer: 'GCZYLNGU4CA5NAWBAVTHMZH4JKXPKR3NKDKZ7XQXQXQXQXQXQXQXQXQX',
      amount: '75000.00',
      asset: 'USDC',
      status: ContractStatus.DocumentsPending,
      requiredDocuments: [
        DocumentType.BillOfLading,
        DocumentType.InspectionCertificate,
        DocumentType.CustomsDeclaration,
      ],
      issuingBank: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      createdAt: Date.now() - 86400000 * 10,
      expiryDate: Date.now() + 86400000 * 20,
    },
  ];
  
  return mockTrades;
};

export const cancelTrade = async (tradeId: string): Promise<string> => {
  const client = getAzakaClient();
  
  console.log('Cancelling trade:', tradeId);
  
  // Simulate transaction
  return 'mock-cancel-tx-' + Date.now();
};
