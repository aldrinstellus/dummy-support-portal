import { cn } from '@/lib/utils';
import { TicketPriority, PRIORITY_CONFIG } from '@/types/ticket';

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        config.bgColor,
        config.color,
        priority === 'urgent' && 'animate-pulse',
        className
      )}
      role="status"
      aria-label={`Priority: ${config.label}`}
    >
      {priority === 'urgent' && (
        <span className="mr-1" aria-hidden="true">
          !
        </span>
      )}
      {config.label}
    </span>
  );
}
