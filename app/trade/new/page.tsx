'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { Navbar } from '@/components/layout/Navbar';
import { CreateTradeForm } from '@/components/forms/CreateTradeForm';

export default function NewTradePage() {
  const router = useRouter();
  const { connected } = useWallet();

  useEffect(() => {
    if (!connected) {
      router.push('/connect');
    }
  }, [connected, router]);

  if (!connected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Create New Trade
          </h1>
          <p className="text-text-secondary">
            Set up a new trade finance agreement with document requirements and escrow
          </p>
        </div>

        <CreateTradeForm />
      </div>
    </div>
  );
}
