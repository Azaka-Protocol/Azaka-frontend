import { Networks } from '@stellar/stellar-sdk';

export type StellarNetwork = 'testnet' | 'mainnet';

export const getNetworkPassphrase = (network: StellarNetwork): string => {
  return network === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET;
};

export const getHorizonUrl = (): string => {
  return process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';
};

export const getSorobanRpcUrl = (): string => {
  return process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';
};

export const getCurrentNetwork = (): StellarNetwork => {
  return (process.env.NEXT_PUBLIC_STELLAR_NETWORK as StellarNetwork) || 'testnet';
};

export const getStellarExpertUrl = (network: StellarNetwork): string => {
  return network === 'mainnet'
    ? 'https://stellar.expert/explorer/public'
    : 'https://stellar.expert/explorer/testnet';
};

export const getTransactionUrl = (txHash: string, network: StellarNetwork): string => {
  return `${getStellarExpertUrl(network)}/tx/${txHash}`;
};

export const getAccountUrl = (address: string, network: StellarNetwork): string => {
  return `${getStellarExpertUrl(network)}/account/${address}`;
};
