import toast from 'react-hot-toast';
import { getTransactionUrl, getCurrentNetwork } from '@/lib/stellar/network';

export const showTxPending = (message: string = 'Submitting to Stellar...') => {
  return toast.loading(message, {
    duration: Infinity,
  });
};

export const showTxSuccess = (txHash: string, message: string = 'Transaction confirmed') => {
  const network = getCurrentNetwork();
  const url = getTransactionUrl(txHash, network);
  
  return toast.success(
    <div className="flex flex-col gap-1">
      <span className="font-medium">{message}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-brand hover:underline"
      >
        View on Stellar Expert →
      </a>
    </div>,
    {
      duration: 6000,
    }
  );
};

export const showTxError = (error: Error | string) => {
  const message = typeof error === 'string' ? error : error.message;
  
  // Clean up Soroban error messages for user display
  const cleanMessage = message
    .replace(/^Error: /, '')
    .replace(/HostError.*/, 'Transaction failed. Please try again.')
    .replace(/Simulation failed.*/, 'Transaction simulation failed. Please check your inputs.');
  
  return toast.error(cleanMessage, {
    duration: 6000,
  });
};

export const dismissTx = (toastId: string) => {
  toast.dismiss(toastId);
};
