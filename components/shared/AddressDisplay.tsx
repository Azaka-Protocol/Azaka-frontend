'use client';

import { useState } from 'react';
import { formatAddress, copyToClipboard } from '@/lib/utils/format';
import { getCurrentNetwork } from '@/lib/stellar/network';
import { getAccountUrl } from '@/lib/stellar/network';
import clsx from 'clsx';

interface AddressDisplayProps {
  address: string;
  startChars?: number;
  endChars?: number;
  showCopy?: boolean;
  showLink?: boolean;
  className?: string;
}

export const AddressDisplay = ({
  address,
  startChars = 5,
  endChars = 4,
  showCopy = true,
  showLink = true,
  className,
}: AddressDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(address);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewExplorer = () => {
    const url = getAccountUrl(address, getCurrentNetwork());
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      <span className="font-mono text-sm text-text-secondary">
        {formatAddress(address, startChars, endChars)}
      </span>
      
      {showCopy && (
        <button
          onClick={handleCopy}
          className="text-text-muted hover:text-brand transition-colors"
          title={copied ? 'Copied!' : 'Copy address'}
        >
          {copied ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      )}
      
      {showLink && (
        <button
          onClick={handleViewExplorer}
          className="text-text-muted hover:text-brand transition-colors"
          title="View on Stellar Expert"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      )}
    </div>
  );
};
