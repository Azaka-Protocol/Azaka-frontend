'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { useTrade } from '@/hooks/useTrade';
import { Navbar } from '@/components/layout/Navbar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { TradeTimeline } from '@/components/trade/TradeTimeline';
import { DocumentChecklist } from '@/components/trade/DocumentChecklist';
import { EscrowStatus } from '@/components/trade/EscrowStatus';
import { formatCurrency, formatTimeRemaining } from '@/lib/utils/format';
import { ParticipantRole } from '@/lib/azaka/types';

export default function TradeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { address, connected, role } = useWallet();
  const { data: trade, isLoading } = useTrade(id);

  useEffect(() => {
    if (!connected) {
      router.push('/connect');
    }
  }, [connected, router]);

  if (!connected || !address) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-surface-secondary rounded w-1/3" />
            <div className="h-64 bg-surface-secondary rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Trade Not Found</h2>
            <p className="text-text-secondary">The trade you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const isExporter = trade.exporter === address;
  const isImporter = trade.importer === address;
  const canSubmitDocs = role === ParticipantRole.FreightForwarder || role === ParticipantRole.Inspector;

  // Mock events for timeline
  const mockEvents = [
    {
      tradeId: trade.id,
      eventType: 'TradeCreated',
      actor: trade.exporter,
      timestamp: trade.createdAt,
    },
    {
      tradeId: trade.id,
      eventType: 'EscrowDeposited',
      actor: trade.importer,
      timestamp: trade.createdAt + 3600000,
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-text-muted mb-1">Trade ID</div>
              <h1 className="text-3xl font-bold text-text-primary font-mono">{trade.id}</h1>
            </div>
            <StatusBadge status={trade.status} className="text-base px-4 py-2" />
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-text-muted">Amount: </span>
              <span className="text-2xl font-bold text-accent">
                {formatCurrency(trade.amount, trade.asset)}
              </span>
            </div>
            <div>
              <span className="text-text-muted">Expires: </span>
              <span className="text-text-primary font-medium">
                {formatTimeRemaining(trade.expiryDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Participants */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Participants</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-text-muted mb-1">Exporter</div>
                  <AddressDisplay address={trade.exporter} />
                  {isExporter && (
                    <span className="ml-2 px-2 py-0.5 bg-brand-light text-brand text-xs rounded-full">
                      You
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm text-text-muted mb-1">Importer</div>
                  <AddressDisplay address={trade.importer} />
                  {isImporter && (
                    <span className="ml-2 px-2 py-0.5 bg-brand-light text-brand text-xs rounded-full">
                      You
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm text-text-muted mb-1">Issuing Bank</div>
                  <AddressDisplay address={trade.issuingBank} />
                </div>
                {trade.confirmingBank && (
                  <div>
                    <div className="text-sm text-text-muted mb-1">Confirming Bank</div>
                    <AddressDisplay address={trade.confirmingBank} />
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Required Documents</h2>
              <DocumentChecklist
                tradeId={trade.id}
                requiredDocuments={trade.requiredDocuments}
                canSubmit={canSubmitDocs}
              />
            </div>

            {/* Timeline */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Trade Timeline</h2>
              <TradeTimeline events={mockEvents} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <EscrowStatus
              tradeId={trade.id}
              tradeStatus={trade.status}
              isExporter={isExporter}
              isImporter={isImporter}
            />

            {/* Quick Actions */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-surface-secondary rounded-md transition-colors">
                  📄 Download Documents
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-surface-secondary rounded-md transition-colors">
                  📧 Contact Participants
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-surface-secondary rounded-md transition-colors">
                  📊 Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
