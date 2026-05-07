import { ContractStatus, getStatusLabel } from '@/lib/azaka/types';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: ContractStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusColor = (status: ContractStatus): string => {
    switch (status) {
      case ContractStatus.PendingEscrow:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case ContractStatus.Active:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case ContractStatus.DocumentsPending:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
      case ContractStatus.Settled:
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case ContractStatus.Cancelled:
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case ContractStatus.Expired:
        return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        getStatusColor(status),
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
};
