'use client';

import { TradeEvent } from '@/lib/azaka/types';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { formatDateTime } from '@/lib/utils/format';

interface TradeTimelineProps {
  events: TradeEvent[];
}

const getEventIcon = (eventType: string): string => {
  switch (eventType) {
    case 'TradeCreated':
      return '📝';
    case 'EscrowDeposited':
      return '💰';
    case 'DocumentSubmitted':
      return '📄';
    case 'DocumentVerified':
      return '✅';
    case 'EscrowReleased':
      return '🎉';
    case 'TradeCancelled':
      return '❌';
    default:
      return '•';
  }
};

const getEventLabel = (eventType: string): string => {
  switch (eventType) {
    case 'TradeCreated':
      return 'Trade Created';
    case 'EscrowDeposited':
      return 'Escrow Deposited';
    case 'DocumentSubmitted':
      return 'Document Submitted';
    case 'DocumentVerified':
      return 'Document Verified';
    case 'EscrowReleased':
      return 'Payment Released';
    case 'TradeCancelled':
      return 'Trade Cancelled';
    default:
      return eventType;
  }
};

export const TradeTimeline = ({ events }: TradeTimelineProps) => {
  if (events.length === 0) {
    return <div className="text-center py-8 text-text-muted">No events yet</div>;
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={`${event.tradeId}-${event.timestamp}-${index}`} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-xl">
              {getEventIcon(event.eventType)}
            </div>
            {index < events.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
          </div>

          <div className="flex-1 pb-8">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-text-primary">{getEventLabel(event.eventType)}</h4>
              <span className="text-sm text-text-muted">{formatDateTime(event.timestamp)}</span>
            </div>

            <div className="text-sm text-text-secondary mb-2">
              By <AddressDisplay address={event.actor} showCopy={false} />
            </div>

            {event.data && Object.keys(event.data).length > 0 && (
              <div className="mt-2 p-3 bg-surface-secondary rounded-md text-sm">
                {Object.entries(event.data).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="text-text-muted">{key}:</span>
                    <span className="text-text-primary">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
