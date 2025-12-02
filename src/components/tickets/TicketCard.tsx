'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Ticket, CATEGORY_CONFIG } from '@/types/ticket';
import { formatDate } from '@/lib/utils';

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  const categoryConfig = CATEGORY_CONFIG[ticket.category];

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] focus-within:ring-2 focus-within:ring-ring"
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
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg" aria-hidden="true">
                {categoryConfig.icon}
              </span>
              <h3 className="font-semibold text-sm truncate">{ticket.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground truncate">{ticket.email}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {ticket.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span aria-hidden="true">{categoryConfig.icon}</span>
            <span>{categoryConfig.label}</span>
          </span>
          <time dateTime={ticket.createdAt} aria-label={`Created ${formatDate(ticket.createdAt)}`}>
            {formatDate(ticket.createdAt)}
          </time>
        </div>
        {ticket.aiCategory && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">AI Triage:</span>
            <span className="font-medium">{ticket.aiCategory}</span>
            {ticket.aiConfidence && (
              <span className="text-muted-foreground">
                ({Math.round(ticket.aiConfidence * 100)}% confidence)
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
