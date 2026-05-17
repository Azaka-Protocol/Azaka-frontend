import {
  isConnected,
  getPublicKey,
  signTransaction,
  requestAccess,
  setAllowed,
} from '@stellar/freighter-api';

export interface FreighterWallet {
  address: string;
  connected: boolean;
}

export const checkFreighterInstalled = (): boolean => {
  return typeof window !== 'undefined' && 'freighter' in window;
};

export const connectFreighter = async (): Promise<string> => {
  if (!checkFreighterInstalled()) {
    throw new Error('Freighter wallet is not installed. Please install it from freighter.app');
  }

  const connected = await isConnected();

  if (!connected) {
    await setAllowed();
    await requestAccess();
  }

  const publicKey = await getPublicKey();
  return publicKey;
};

export const getFreighterPublicKey = async (): Promise<string | null> => {
  if (!checkFreighterInstalled()) {
    return null;
  }

  try {
    const connected = await isConnected();
    if (!connected) {
      return null;
    }
    return await getPublicKey();
  } catch (error) {
    console.error('Error getting Freighter public key:', error);
    return null;
  }
};

export const signTransactionWithFreighter = async (
  xdr: string,
  network: string
): Promise<string> => {
  if (!checkFreighterInstalled()) {
    throw new Error('Freighter wallet is not installed');
  }

  try {
    const signedXdr = await signTransaction(xdr, {
      network,
      accountToSign: await getPublicKey(),
    });
    return signedXdr;
  } catch (error) {
    console.error('Error signing transaction with Freighter:', error);
    throw new Error('Failed to sign transaction. Please try again.');
  }
};

export const disconnectFreighter = async (): Promise<void> => {
  // Freighter doesn't have a disconnect method, so we just clear local state
  // The actual disconnection happens in the wallet store
};
