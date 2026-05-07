'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { ParticipantRole, getRoleLabel } from '@/lib/azaka/types';
import { checkFreighterInstalled } from '@/lib/stellar/freighter';
import clsx from 'clsx';

const roles = [
  {
    role: ParticipantRole.Exporter,
    icon: '📦',
    description: 'Create trades and receive payments for exported goods',
  },
  {
    role: ParticipantRole.Importer,
    icon: '🏢',
    description: 'Purchase goods and manage escrow deposits',
  },
  {
    role: ParticipantRole.IssuingBank,
    icon: '🏦',
    description: 'Issue and confirm letters of credit',
  },
  {
    role: ParticipantRole.FreightForwarder,
    icon: '🚢',
    description: 'Submit shipping and inspection documents',
  },
];

export default function ConnectPage() {
  const router = useRouter();
  const { connected, connect, setRole } = useWallet();
  const [selectedRole, setSelectedRole] = useState<ParticipantRole | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkFreighterInstalled()) {
      setError('Freighter wallet is not installed. Please install it from freighter.app');
    }
  }, []);

  const handleConnect = async () => {
    if (!selectedRole && selectedRole !== 0) {
      setError('Please select a role');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await connect();
      setRole(selectedRole);
      
      // Redirect to appropriate dashboard
      const dashboardPaths: Record<ParticipantRole, string> = {
        [ParticipantRole.Exporter]: '/dashboard/exporter',
        [ParticipantRole.Importer]: '/dashboard/importer',
        [ParticipantRole.IssuingBank]: '/dashboard/bank',
        [ParticipantRole.ConfirmingBank]: '/dashboard/bank',
        [ParticipantRole.FreightForwarder]: '/dashboard/forwarder',
        [ParticipantRole.Inspector]: '/dashboard/forwarder',
      };

      router.push(dashboardPaths[selectedRole]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  if (connected) {
    router.push('/dashboard/exporter');
    return null;
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Connect to Azaka
          </h1>
          <p className="text-text-secondary">
            Select your role and connect your Freighter wallet to get started
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-danger text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {roles.map(({ role, icon, description }) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={clsx(
                'p-6 border-2 rounded-lg text-left transition-all',
                selectedRole === role
                  ? 'border-brand bg-brand-light'
                  : 'border-border hover:border-brand/50'
              )}
            >
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {getRoleLabel(role)}
              </h3>
              <p className="text-sm text-text-secondary">{description}</p>
            </button>
          ))}
        </div>

        <button
          onClick={handleConnect}
          disabled={isConnecting || selectedRole === null}
          className={clsx(
            'w-full py-4 rounded-lg font-medium text-lg transition-colors',
            isConnecting || selectedRole === null
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-brand text-white hover:bg-brand-dark'
          )}
        >
          {isConnecting ? 'Connecting...' : 'Connect Freighter Wallet'}
        </button>

        <p className="text-center text-sm text-text-muted mt-6">
          Don&apos;t have Freighter?{' '}
          <a
            href="https://freighter.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            Install it here
          </a>
        </p>
      </div>
    </div>
  );
}
