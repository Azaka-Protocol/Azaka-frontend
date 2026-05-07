'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletButton } from '@/components/shared/WalletButton';
import { useWallet } from '@/hooks/useWallet';
import { getRoleLabel } from '@/lib/azaka/types';
import clsx from 'clsx';

export const Navbar = () => {
  const pathname = usePathname();
  const { connected, role } = useWallet();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl text-text-primary">Azaka</span>
            </Link>

            {connected && (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className={clsx(
                    'text-sm font-medium transition-colors hover:text-brand',
                    isActive('/dashboard') ? 'text-brand' : 'text-text-secondary'
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/trade/new"
                  className={clsx(
                    'text-sm font-medium transition-colors hover:text-brand',
                    isActive('/trade/new') ? 'text-brand' : 'text-text-secondary'
                  )}
                >
                  New Trade
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {connected && role !== null && (
              <div className="hidden sm:block px-3 py-1 bg-brand-light text-brand text-sm rounded-full font-medium">
                {getRoleLabel(role)}
              </div>
            )}
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
