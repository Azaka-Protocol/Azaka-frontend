import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { connectFreighter, disconnectFreighter } from '@/lib/stellar/freighter';
import { initializeAzakaClient } from '@/lib/azaka/client';
import { ParticipantRole } from '@/lib/azaka/types';

interface WalletState {
  address: string | null;
  connected: boolean;
  role: ParticipantRole | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setRole: (role: ParticipantRole) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      address: null,
      connected: false,
      role: null,

      connect: async () => {
        try {
          const address = await connectFreighter();
          initializeAzakaClient(address);
          set({ address, connected: true });
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          throw error;
        }
      },

      disconnect: async () => {
        try {
          await disconnectFreighter();
          set({ address: null, connected: false, role: null });
        } catch (error) {
          console.error('Failed to disconnect wallet:', error);
          throw error;
        }
      },

      setRole: (role: ParticipantRole) => {
        set({ role });
      },
    }),
    {
      name: 'azaka-wallet-storage',
      partialize: (state) => ({
        address: state.address,
        connected: state.connected,
        role: state.role,
      }),
    }
  )
);
