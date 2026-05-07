import Link from 'next/link';
import { Trade } from '@/lib/azaka/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { formatCurrency, formatDate } from '@/lib/utils/format';

interface TradeCardProps {
  trade: Trade;
}

export const TradeCard = ({ trade }: TradeCardProps) => {
  return (
    <Link
      href={`/trade/${trade.id}`}
      className="block p-6 bg-surface border border-border rounded-lg hover:border-brand transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm text-text-muted mb-1">Trade ID</div>
          <div className="font-mono text-text-primary font-medium">{trade.id}</div>
        </div>
        <StatusBadge status={trade.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-text-muted mb-1">Amount</div>
          <div className="text-xl font-bold text-accent">
            {formatCurrency(trade.amount, trade.asset)}
          </div>
        </div>
        <div>
          <div className="text-sm text-text-muted mb-1">Documents</div>
          <div className="text-text-primary">
            {trade.requiredDocuments.length} required
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-text-muted mb-1">Exporter</div>
          <AddressDisplay address={trade.exporter} showCopy={false} showLink={false} />
        </div>
        <div>
          <div className="text-sm text-text-muted mb-1">Importer</div>
          <AddressDisplay address={trade.importer} showCopy={false} showLink={false} />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>Created {formatDate(trade.createdAt)}</span>
        <span>Expires {formatDate(trade.expiryDate)}</span>
      </div>
    </Link>
  );
};
