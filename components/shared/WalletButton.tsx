'use client';

import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { formatAddress, copyToClipboard } from '@/lib/utils/format';
import { getCurrentNetwork, getAccountUrl } from '@/lib/stellar/network';
import clsx from 'clsx';

export const WalletButton = () => {
  const { address, connected, connect, disconnect } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleCopy = async () => {
    if (address) {
      const success = await copyToClipboard(address);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleViewExplorer = () => {
    if (address) {
      const url = getAccountUrl(address, getCurrentNetwork());
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setIsOpen(false);
  };

  if (!connected || !address) {
    return (
      <button
        onClick={handleConnect}
        className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-colors font-medium"
      >
        Connect Wallet
      </button>
    );
  }

  const network = getCurrentNetwork();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-surface-secondary border border-border rounded-md hover:bg-brand-light transition-colors"
      >
        <div className="w-2 h-2 bg-success rounded-full" />
        <span className="font-mono text-sm">{formatAddress(address)}</span>
        <span className="px-2 py-0.5 bg-brand-light text-brand text-xs rounded-full font-medium">
          {network}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b border-border">
            <div className="text-xs text-text-muted mb-1">Connected Address</div>
            <div className="font-mono text-sm text-text-primary break-all">{address}</div>
          </div>

          <div className="py-1">
            <button
              onClick={handleCopy}
              className="w-full px-4 py-2 text-left text-sm hover:bg-surface-secondary transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? 'Copied!' : 'Copy Address'}
            </button>

            <button
              onClick={handleViewExplorer}
              className="w-full px-4 py-2 text-left text-sm hover:bg-surface-secondary transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on Stellar Expert
            </button>

            <button
              onClick={handleDisconnect}
              className="w-full px-4 py-2 text-left text-sm hover:bg-surface-secondary transition-colors flex items-center gap-2 text-danger"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
