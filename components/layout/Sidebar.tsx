'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { ParticipantRole } from '@/lib/azaka/types';
import clsx from 'clsx';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: ParticipantRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
  },
  {
    label: 'New Trade',
    href: '/trade/new',
    icon: '➕',
    roles: [ParticipantRole.Exporter],
  },
  {
    label: 'My Trades',
    href: '/dashboard',
    icon: '📦',
  },
  {
    label: 'Documents',
    href: '/documents',
    icon: '📄',
    roles: [ParticipantRole.FreightForwarder, ParticipantRole.Inspector],
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { role } = useWallet();

  const filteredItems = navItems.filter(
    item => !item.roles || (role !== null && item.roles.includes(role))
  );

  return (
    <aside className="w-64 bg-surface border-r border-border min-h-screen p-4">
      <nav className="space-y-2">
        {filteredItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              pathname === item.href
                ? 'bg-brand-light text-brand font-medium'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
