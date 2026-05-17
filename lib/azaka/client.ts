// Thin wrapper around Azaka TypeScript SDK
// This module provides a singleton client instance configured with the connected wallet

import { getCurrentNetwork, getNetworkPassphrase, getSorobanRpcUrl } from '../stellar/network';

// Placeholder for actual Azaka SDK import
// import { AzakaClient } from 'azaka-sdk';

interface AzakaClientConfig {
  network: string;
  rpcUrl: string;
  contractIds: {
    trade: string;
    escrow: string;
    document: string;
    registry: string;
  };
}

class AzakaClientWrapper {
  private config: AzakaClientConfig;
  private publicKey: string | null = null;

  constructor() {
    this.config = {
      network: getNetworkPassphrase(getCurrentNetwork()),
      rpcUrl: getSorobanRpcUrl(),
      contractIds: {
        trade: process.env.NEXT_PUBLIC_TRADE_CONTRACT_ID || '',
        escrow: process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID || '',
        document: process.env.NEXT_PUBLIC_DOCUMENT_CONTRACT_ID || '',
        registry: process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ID || '',
      },
    };
  }

  setPublicKey(publicKey: string) {
    this.publicKey = publicKey;
  }

  getPublicKey(): string | null {
    return this.publicKey;
  }

  getConfig(): AzakaClientConfig {
    return this.config;
  }

  // Placeholder methods - these would call the actual Azaka SDK
  async simulateTransaction(xdr: string): Promise<string> {
    // In production, this would use the Azaka SDK to simulate the transaction
    return xdr;
  }

  async submitTransaction(_signedXdr: string): Promise<string> {
    // In production, this would use the Azaka SDK to submit the transaction
    return 'mock-tx-hash-' + Date.now();
  }
}

let clientInstance: AzakaClientWrapper | null = null;

export const getAzakaClient = (): AzakaClientWrapper => {
  if (!clientInstance) {
    clientInstance = new AzakaClientWrapper();
  }
  return clientInstance;
};

export const initializeAzakaClient = (publicKey: string): AzakaClientWrapper => {
  const client = getAzakaClient();
  client.setPublicKey(publicKey);
  return client;
};
