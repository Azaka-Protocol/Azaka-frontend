'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { useTradesByParticipant } from '@/hooks/useTrade';
import { Navbar } from '@/components/layout/Navbar';
import { TradeCard } from '@/components/trade/TradeCard';
import { formatCurrency } from '@/lib/utils/format';
import clsx from 'clsx';

type TabType = 'issuing' | 'confirming';

export default function BankDashboard() {
  const router = useRouter();
  const { address, connected } = useWallet();
  const { data: trades, isLoading } = useTradesByParticipant(address || '', 'bank');
  const [activeTab, setActiveTab] = useState<TabType>('issuing');

  useEffect(() => {
    if (!connected) {
      router.push('/connect');
    }
  }, [connected, router]);

  if (!connected || !address) {
    return null;
  }

  const issuingTrades = trades?.filter(t => t.issuingBank === address) || [];
  const confirmingTrades = trades?.filter(t => t.confirmingBank === address) || [];

  const totalLCValue = trades?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

  const displayTrades = activeTab === 'issuing' ? issuingTrades : confirmingTrades;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Bank Dashboard
          </h1>
          <p className="text-text-secondary">
            Manage letters of credit and trade confirmations
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-surface border border-border rounded-lg">
            <div className="text-sm text-text-muted mb-1">Trades Issued</div>
            <div className="text-3xl font-bold text-text-primary">{issuingTrades.length}</div>
          </div>

          <div className="p-6 bg-surface border border-border rounded-lg">
            <div className="text-sm text-text-muted mb-1">Trades Confirmed</div>
            <div className="text-3xl font-bold text-text-primary">{confirmingTrades.length}</div>
          </div>

          <div className="p-6 bg-surface border border-border rounded-lg">
            <div className="text-sm text-text-muted mb-1">Total LC Value</div>
            <div className="text-3xl font-bold text-accent">
              {formatCurrency(totalLCValue, 'USDC', 0)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="border-b border-border">
            <div className="flex">
              <button
                onClick={() => setActiveTab('issuing')}
                className={clsx(
                  'flex-1 px-6 py-4 font-medium transition-colors',
                  activeTab === 'issuing'
                    ? 'text-brand border-b-2 border-brand bg-brand-light'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                Issuing ({issuingTrades.length})
              </button>
              <button
                onClick={() => setActiveTab('confirming')}
                className={clsx(
                  'flex-1 px-6 py-4 font-medium transition-colors',
                  activeTab === 'confirming'
                    ? 'text-brand border-b-2 border-brand bg-brand-light'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                Confirming ({confirmingTrades.length})
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
            </div>
          ) : displayTrades.length > 0 ? (
            <div className="p-6 grid gap-4">
              {displayTrades.map(trade => (
                <TradeCard key={trade.id} trade={trade} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🏦</div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No {activeTab} trades
              </h3>
              <p className="text-text-secondary">
                {activeTab === 'issuing' 
                  ? 'Trades where you are the issuing bank will appear here'
                  : 'Trades where you are the confirming bank will appear here'
                }
              </p>
            </div>
          )}
        </div>

        {/* Pending Confirmations */}
        {activeTab === 'confirming' && (
          <div className="mt-8 bg-surface border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-text-primary">Pending Confirmations</h2>
            </div>
            <div className="p-12 text-center text-text-muted">
              No pending confirmations
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
