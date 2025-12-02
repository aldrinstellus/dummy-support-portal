'use client';

import { Circle, AlertCircle } from 'lucide-react';
import { Ticket, STATUS_CONFIG, PRIORITY_CONFIG } from '@/types/ticket';
import { formatDate } from '@/lib/utils';

interface TicketRowProps {
  ticket: Ticket;
  onClick?: () => void;
}

const STATUS_COLORS = {
  open: 'text-[var(--status-open)]',
  in_progress: 'text-[var(--status-in-progress)]',
  resolved: 'text-[var(--status-resolved)]',
  closed: 'text-[var(--status-closed)]',
};

export function TicketRow({ ticket, onClick }: TicketRowProps) {
  const priorityConfig = PRIORITY_CONFIG[ticket.priority];
  const statusConfig = STATUS_CONFIG[ticket.status];

  return (
    <div
      className="ticket-row group"
      onClick={onClick}
      tabIndex={0}
      role="article"
      aria-label={`Ticket from ${ticket.name}: ${ticket.description.slice(0, 50)}...`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Status Indicator */}
      <div className="flex-shrink-0">
        {ticket.priority === 'urgent' ? (
          <AlertCircle
            className={`h-4 w-4 ${STATUS_COLORS[ticket.status]} animate-pulse`}
            aria-hidden="true"
          />
        ) : (
          <Circle
            className={`h-4 w-4 ${STATUS_COLORS[ticket.status]}`}
            fill="currentColor"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Ticket ID */}
      <span className="w-24 flex-shrink-0 font-mono text-xs text-[var(--linear-text-muted)]">
        {ticket.id.toUpperCase().replace('TICKET-', 'TKT-')}
      </span>

      {/* Title / Description */}
      <div className="flex-1 min-w-0 mr-3">
        <p className="truncate text-sm text-[var(--linear-text-primary)] group-hover:text-white">
          {ticket.description}
        </p>
      </div>

      {/* Right side badges container */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Priority Badge */}
        {ticket.priority !== 'low' && (
          <div
            className={`rounded px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ${
              ticket.priority === 'urgent'
                ? 'bg-red-500/20 text-red-400'
                : ticket.priority === 'high'
                ? 'bg-orange-500/20 text-orange-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}
            aria-label={`Priority: ${priorityConfig.label}`}
          >
            {priorityConfig.label}
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`rounded px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ${
            ticket.status === 'open'
              ? 'bg-blue-500/20 text-blue-400'
              : ticket.status === 'in_progress'
              ? 'bg-yellow-500/20 text-yellow-400'
              : ticket.status === 'resolved'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gray-500/20 text-gray-400'
          }`}
          role="status"
          aria-label={`Status: ${statusConfig.label}`}
        >
          {statusConfig.label}
        </div>

        {/* Date */}
        <time
          className="hidden lg:block w-20 text-right text-xs text-[var(--linear-text-muted)] whitespace-nowrap"
          dateTime={ticket.createdAt}
        >
          {formatDate(ticket.createdAt)}
        </time>

        {/* AI Triage Indicator */}
        {ticket.aiConfidence && ticket.aiConfidence > 0.8 && (
          <div
            className="rounded bg-purple-500/20 px-1.5 py-0.5 text-xs text-purple-400"
            title={`AI Triage: ${ticket.aiCategory} (${Math.round(ticket.aiConfidence * 100)}% confidence)`}
          >
            AI
          </div>
        )}
      </div>
    </div>
  );
}
