'use client';

import { Circle, AlertCircle } from 'lucide-react';
import { Ticket, STATUS_CONFIG, PRIORITY_CONFIG, TicketCategory } from '@/types/ticket';
import { formatDate } from '@/lib/utils';

interface TicketRowProps {
  ticket: Ticket;
  onClick?: () => void;
  viewMode?: 'all' | 'inbox' | 'my-tickets';
}

const STATUS_COLORS = {
  open: 'text-[var(--status-open)]',
  in_progress: 'text-[var(--status-in-progress)]',
  resolved: 'text-[var(--status-resolved)]',
  closed: 'text-[var(--status-closed)]',
};

const CATEGORY_CONFIG: Record<TicketCategory, { label: string; color: string }> = {
  technical: { label: 'Technical', color: 'bg-cyan-500/20 text-cyan-400' },
  billing: { label: 'Billing', color: 'bg-emerald-500/20 text-emerald-400' },
  'feature-request': { label: 'Feature', color: 'bg-violet-500/20 text-violet-400' },
  general: { label: 'General', color: 'bg-slate-500/20 text-slate-400' },
};

// View-specific left border accent colors
const VIEW_BORDER_STYLES = {
  inbox: {
    urgent: 'border-l-4 border-l-red-500',
    high: 'border-l-4 border-l-orange-500',
    default: 'border-l-2 border-l-orange-500/30',
  },
  'my-tickets': {
    urgent: 'border-l-4 border-l-purple-500',
    high: 'border-l-4 border-l-indigo-500',
    default: 'border-l-2 border-l-purple-500/30',
  },
  all: {
    urgent: 'border-l-4 border-l-teal-500',
    high: 'border-l-4 border-l-cyan-500',
    default: 'border-l-2 border-l-transparent',
  },
};

export function TicketRow({ ticket, onClick, viewMode = 'all' }: TicketRowProps) {
  const priorityConfig = PRIORITY_CONFIG[ticket.priority];
  const statusConfig = STATUS_CONFIG[ticket.status];
  const categoryConfig = CATEGORY_CONFIG[ticket.category];

  // Get view-specific border style based on priority
  const getBorderStyle = () => {
    const styles = VIEW_BORDER_STYLES[viewMode];
    if (ticket.priority === 'urgent') return styles.urgent;
    if (ticket.priority === 'high') return styles.high;
    return styles.default;
  };

  // Get view-specific hover effect
  const getHoverStyle = () => {
    switch (viewMode) {
      case 'inbox':
        return 'hover:bg-red-500/5';
      case 'my-tickets':
        return 'hover:bg-purple-500/5';
      default:
        return 'hover:bg-[var(--linear-bg-tertiary)]';
    }
  };

  return (
    <div
      className={`ticket-row group ${getBorderStyle()} ${getHoverStyle()}`}
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
      <span className="w-20 flex-shrink-0 font-mono text-xs text-[var(--linear-text-muted)]">
        {ticket.id.toUpperCase().replace('TICKET-', 'TKT-')}
      </span>

      {/* Category Badge */}
      <div
        className={`hidden sm:block rounded px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ${categoryConfig.color}`}
        aria-label={`Category: ${categoryConfig.label}`}
      >
        {categoryConfig.label}
      </div>

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
