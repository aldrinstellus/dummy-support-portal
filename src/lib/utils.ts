import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

// Counter for generating sequential ticket IDs
let ticketCounter = 8; // Starting after mock data (ticket-001 through ticket-008)

export function generateTicketId(): string {
  ticketCounter++;
  return `ticket-${String(ticketCounter).padStart(3, '0')}`;
}

// Initialize counter based on existing tickets
export function initTicketCounter(existingTickets: { id: string }[]): void {
  const maxNum = existingTickets.reduce((max, t) => {
    const match = t.id.match(/ticket-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      return Math.max(max, num);
    }
    return max;
  }, 0);
  ticketCounter = maxNum;
}

// Legacy function kept for compatibility
export function generateId(): string {
  return generateTicketId();
}
