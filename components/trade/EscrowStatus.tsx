'use client';

import { useState, useEffect } from 'react';
import { useEscrow, useReleaseConditions, useReleaseEscrow, useRefundEscrow } from '@/hooks/useEscrow';
import { ContractStatus } from '@/lib/azaka/types';
import { formatCurrency } from '@/lib/utils/format';
import { getUsdEquivalent } from '@/lib/stellar/anchors';
import { showTxPending, showTxSuccess, showTxError, dismissTx } from '@/components/shared/TxToast';
import clsx from 'clsx';

interface EscrowStatusProps {
  tradeId: string;
  tradeStatus: ContractStatus;
  isExporter: boolean;
  isImporter: boolean;
}

export const EscrowStatus = ({ tradeId, tradeStatus, isExporter, isImporter }: EscrowStatusProps) => {
  const { data: escrow, isLoading: escrowLoading } = useEscrow(tradeId);
  const { data: conditions, isLoading: conditionsLoading } = useReleaseConditions(tradeId);
  const releaseEscrow = useReleaseEscrow();
  const refundEscrow = useRefundEscrow();
  const [usdEquivalent, setUsdEquivalent] = useState<number | null>(null);

  useEffect(() => {
    if (escrow) {
      getUsdEquivalent(parseFloat(escrow.amount), escrow.asset).then(setUsdEquivalent);
    }
  }, [escrow]);

  if (escrowLoading || conditionsLoading) {
    return (
      <div className="p-6 bg-surface border border-border rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-surface-secondary rounded w-1/3" />
          <div className="h-8 bg-surface-secondary rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="p-6 bg-surface border border-border rounded-lg">
        <div className="text-center text-text-muted">
          No escrow deposited yet
        </div>
      </div>
    );
  }

  const handleRelease = async () => {
    const toastId = showTxPending('Releasing escrow payment...');
    try {
      const txHash = await releaseEscrow.mutateAsync(tradeId);
      dismissTx(toastId);
      showTxSuccess(txHash, 'Escrow released successfully');
    } catch (error) {
      dismissTx(toastId);
      showTxError(error as Error);
    }
  };

  const handleRefund = async () => {
    const toastId = showTxPending('Processing refund...');
    try {
      const txHash = await refundEscrow.mutateAsync(tradeId);
      dismissTx(toastId);
      showTxSuccess(txHash, 'Escrow refunded successfully');
    } catch (error) {
      dismissTx(toastId);
      showTxError(error as Error);
    }
  };

  const progress = conditions
    ? (conditions.documentsVerified / conditions.documentsRequired) * 100
    : 0;

  const canRelease = conditions?.canRelease && isExporter;
  const canRefund = tradeStatus === ContractStatus.Expired && isImporter;

  return (
    <div className="p-6 bg-surface border border-border rounded-lg">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Escrow Status</h3>

      <div className="mb-6">
        <div className="text-sm text-text-muted mb-1">Locked Amount</div>
        <div className="text-3xl font-bold text-accent mb-1">
          {formatCurrency(escrow.amount, escrow.asset)}
        </div>
        {usdEquivalent !== null && escrow.asset !== 'USDC' && (
          <div className="text-sm text-text-secondary">
            ≈ ${usdEquivalent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </div>
        )}
      </div>

      {conditions && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-text-muted">Document Verification</span>
            <span className="text-text-primary font-medium">
              {conditions.documentsVerified} of {conditions.documentsRequired}
            </span>
          </div>
          <div className="w-full bg-surface-secondary rounded-full h-2 overflow-hidden">
            <div
              className={clsx(
                'h-full transition-all duration-500',
                progress === 100 ? 'bg-success' : 'bg-brand'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {canRelease && (
          <button
            onClick={handleRelease}
            disabled={releaseEscrow.isPending}
            className="flex-1 px-4 py-3 bg-success text-white rounded-lg hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {releaseEscrow.isPending ? 'Releasing...' : 'Release Payment'}
          </button>
        )}

        {canRefund && (
          <button
            onClick={handleRefund}
            disabled={refundEscrow.isPending}
            className="flex-1 px-4 py-3 bg-warning text-white rounded-lg hover:bg-warning/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {refundEscrow.isPending ? 'Processing...' : 'Request Refund'}
          </button>
        )}

        {!canRelease && !canRefund && (
          <div className="flex-1 px-4 py-3 bg-surface-secondary text-text-muted rounded-lg text-center">
            {escrow.released ? 'Payment Released' : 'Awaiting Document Verification'}
          </div>
        )}
      </div>
    </div>
  );
};
