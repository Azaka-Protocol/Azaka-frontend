'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { useTradesByParticipant } from '@/hooks/useTrade';
import { useDepositEscrow } from '@/hooks/useEscrow';
import { Navbar } from '@/components/layout/Navbar';
import { TradeCard } from '@/components/trade/TradeCard';
import { ContractStatus } from '@/lib/azaka/types';
import { formatCurrency } from '@/lib/utils/format';
import { showTxPending, showTxSuccess, showTxError, dismissTx } from '@/components/shared/TxToast';

export default function ImporterDashboard() {
  const router = useRouter();
  const { address, connected } = useWallet();
  const { data: trades, isLoading } = useTradesByParticipant(address || '', 'importer');
  const depositEscrow = useDepositEscrow();

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

  const fundsInEscrow = trades
    ?.filter(t => t.status !== ContractStatus.Settled && t.status !== ContractStatus.Cancelled)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

  const settledTrades = trades?.filter(t => 
    t.status === ContractStatus.Settled
  ).length || 0;

  const handleDepositEscrow = async (tradeId: string, amount: string, asset: string) => {
    const toastId = showTxPending('Depositing escrow...');
    try {
      const txHash = await depositEscrow.mutateAsync({ tradeId, amount, asset });
      dismissTx(toastId);
      showTxSuccess(txHash, 'Escrow deposited successfully');
    } catch (error) {
      dismissTx(toastId);
      showTxError(error as Error);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Importer Dashboard
          </h1>
          <p className="text-text-secondary">
            Manage your import trades and escrow deposits
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-surface border border-border rounded-lg">
            <div className="text-sm text-text-muted mb-1">Active Trades</div>
            <div className="text-3xl font-bold text-text-primary">{activeTrades}</div>
          </div>

          <div className="p-6 bg-surface border border-border rounded-lg">
            <div className="text-sm text-text-muted mb-1">Funds in Escrow</div>
            <div className="text-3xl font-bold text-accent">
              {formatCurrency(fundsInEscrow, 'USDC', 0)}
            </div>
          </div>

          <div className="p-6 bg-surface border border-border rounded-lg">
            <div className="text-sm text-text-muted mb-1">Trades Settled</div>
            <div className="text-3xl font-bold text-success">{settledTrades}</div>
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
                <div key={trade.id}>
                  <TradeCard trade={trade} />
                  {trade.status === ContractStatus.PendingEscrow && (
                    <div className="mt-2 p-4 bg-brand-light border border-brand rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-brand font-medium">
                          Escrow deposit required
                        </span>
                        <button
                          onClick={() => handleDepositEscrow(trade.id, trade.amount, trade.asset)}
                          disabled={depositEscrow.isPending}
                          className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                        >
                          {depositEscrow.isPending ? 'Depositing...' : 'Deposit Escrow'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No trades yet
              </h3>
              <p className="text-text-secondary">
                You&apos;ll see trades here when exporters create trades with your address
              </p>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="mt-8 bg-surface border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-text-primary">Transaction History</h2>
          </div>
          <div className="p-12 text-center text-text-muted">
            Transaction history coming soon
          </div>
        </div>
      </div>
    </div>
  );
}
