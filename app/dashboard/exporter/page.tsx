'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { useTradesByParticipant } from '@/hooks/useTrade';
import { Navbar } from '@/components/layout/Navbar';
import { TradeCard } from '@/components/trade/TradeCard';
import { ContractStatus } from '@/lib/azaka/types';
import { formatCurrency } from '@/lib/utils/format';

export default function ExporterDashboard() {
  const router = useRouter();
  const { address, connected } = useWallet();
  const { data: trades, isLoading } = useTradesByParticipant(address || '', 'exporter');

  useEffect(() => {
    if (!connected) {
      router.push('/connect');
    }
  }, [connected, router]);

  if (!connected || !address) {
    return null;
  }

  const activeTrades = trades?.filter(t => 
    t.status === ContractStatus.Active || t.status === ContractStatus.DocumentsPending
  ).length || 0;

  const pendingDocs = trades?.filter(t => 
    t.status === ContractStatus.DocumentsPending
  ).length || 0;

  const settledTrades = trades?.filter(t => 
    t.status === ContractStatus.Settled
  ) || [];

  const totalSettled = settledTrades.reduce((sum, t) => 
    sum + parseFloat(t.amount), 0
  );

  const avgSettlementTime = '3.2 days'; // Mock data

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Exporter Dashboard
            </h1>
            <p className="text-text-secondary">
              Manage your export trades and track payments
            </p>
          </div>
          <Link
            href="/trade/new"
            className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-medium"
          >
            + New Trade
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-surface border border-border rounded-lg">
            <div className="text-sm text-text-muted mb-1">Active Trades</div>
            <div className="text-3xl font-bold text-text-primary">{activeTrades}</div>
          </div>

          <div className="p-6 bg-surface border border-border rounded-lg">
            <div className="text-sm text-text-muted mb-1">Pending Documents</div>
            <div className="text-3xl font-bold text-warning">{pendingDocs}</div>
          </div>

          <div className="p-6 bg-surface border border-border rounded-lg">
            <div className="text-sm text-text-muted mb-1">Total Settled</div>
            <div className="text-3xl font-bold text-accent">
              {formatCurrency(totalSettled, 'USDC', 0)}
            </div>
          </div>

          <div className="p-6 bg-surface border border-border rounded-lg">
            <div className="text-sm text-text-muted mb-1">Avg Settlement Time</div>
            <div className="text-3xl font-bold text-text-primary">{avgSettlementTime}</div>
          </div>
        </div>

        {/* Trades Table */}
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-text-primary">Your Trades</h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
            </div>
          ) : trades && trades.length > 0 ? (
            <div className="p-6 grid gap-4">
              {trades.map(trade => (
                <TradeCard key={trade.id} trade={trade} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No trades yet
              </h3>
              <p className="text-text-secondary mb-6">
                Create your first trade to start receiving payments for your exports
              </p>
              <Link
                href="/trade/new"
                className="inline-block px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-medium"
              >
                Create Your First Trade
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
