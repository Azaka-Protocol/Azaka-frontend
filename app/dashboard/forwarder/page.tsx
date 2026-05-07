'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { useTradesByParticipant } from '@/hooks/useTrade';
import { Navbar } from '@/components/layout/Navbar';
import { ContractStatus, getDocumentTypeLabel } from '@/lib/azaka/types';
import { formatDate } from '@/lib/utils/format';

export default function ForwarderDashboard() {
  const router = useRouter();
  const { address, connected } = useWallet();
  const { data: trades, isLoading } = useTradesByParticipant(address || '');

  useEffect(() => {
    if (!connected) {
      router.push('/connect');
    }
  }, [connected, router]);

  if (!connected || !address) {
    return null;
  }

  // Mock data for document queue
  const pendingDocs = trades?.filter(t => 
    t.status === ContractStatus.Active || t.status === ContractStatus.DocumentsPending
  ).flatMap(t => 
    t.requiredDocuments.map(docType => ({
      tradeId: t.id,
      docType,
      deadline: t.expiryDate,
    }))
  ) || [];

  const docsSubmitted = 12; // Mock
  const docsPendingSignature = 3; // Mock

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Freight Forwarder Dashboard
          </h1>
          <p className="text-text-secondary">
            Submit and manage trade documents
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-surface border border-border rounded-lg">
            <div className="text-sm text-text-muted mb-1">Docs Submitted</div>
            <div className="text-3xl font-bold text-success">{docsSubmitted}</div>
          </div>

          <div className="p-6 bg-surface border border-border rounded-lg">
            <div className="text-sm text-text-muted mb-1">Docs Pending Signature</div>
            <div className="text-3xl font-bold text-warning">{docsPendingSignature}</div>
          </div>

          <div className="p-6 bg-surface border border-border rounded-lg">
            <div className="text-sm text-text-muted mb-1">Trades Involved</div>
            <div className="text-3xl font-bold text-text-primary">{trades?.length || 0}</div>
          </div>
        </div>

        {/* Document Queue */}
        <div className="bg-surface border border-border rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-text-primary">Document Queue</h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
            </div>
          ) : pendingDocs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Trade ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Document Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pendingDocs.map((doc, index) => (
                    <tr key={`${doc.tradeId}-${doc.docType}-${index}`} className="hover:bg-surface-secondary">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/trade/${doc.tradeId}`} className="font-mono text-sm text-brand hover:underline">
                          {doc.tradeId}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {getDocumentTypeLabel(doc.docType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {formatDate(doc.deadline)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/trade/${doc.tradeId}`}
                          className="px-3 py-1 bg-brand text-white rounded-md hover:bg-brand-dark text-sm font-medium transition-colors"
                        >
                          Upload
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🚢</div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No pending documents
              </h3>
              <p className="text-text-secondary">
                Document submission requests will appear here
              </p>
            </div>
          )}
        </div>

        {/* Recently Submitted */}
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-text-primary">Recently Submitted</h2>
          </div>
          <div className="p-12 text-center text-text-muted">
            No recently submitted documents
          </div>
        </div>
      </div>
    </div>
  );
}
