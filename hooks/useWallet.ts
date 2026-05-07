import { useWalletStore } from '@/store/wallet';

export const useWallet = () => {
  const { address, connected, role, connect, disconnect, setRole } = useWalletStore();

  return {
    address,
    connected,
    role,
    connect,
    disconnect,
    setRole,
  };
};
