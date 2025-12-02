'use client';

import { useState, useEffect } from 'react';
import { TicketRow } from './TicketRow';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '@/types/ticket';
import { RefreshCw, Filter, SlidersHorizontal } from 'lucide-react';

interface TicketListProps {
  initialTickets?: Ticket[];
  categoryFilter?: TicketCategory | null;
  viewMode?: 'all' | 'inbox' | 'my-tickets';
}

type TabType = 'all' | 'open' | 'in_progress' | 'resolved';

export function TicketList({ initialTickets = [], categoryFilter, viewMode = 'all' }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [isLoading, setIsLoading] = useState(!initialTickets.length);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [filters, setFilters] = useState<{
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
  }>({});

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      // Apply view mode filter for inbox (open & in_progress only)
      if (viewMode === 'inbox') {
        // We'll filter client-side for inbox since API doesn't support multiple statuses
      }

      // Apply tab filter
      if (activeTab !== 'all') {
        params.set('status', activeTab);
      } else if (filters.status) {
        params.set('status', filters.status);
      }
      if (filters.priority) params.set('priority', filters.priority);

      // Apply category filter from sidebar or local filter
      if (categoryFilter) {
        params.set('category', categoryFilter);
      } else if (filters.category) {
        params.set('category', filters.category);
      }

      const response = await fetch(`/api/tickets?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tickets');

      const data = await response.json();
      let fetchedTickets: Ticket[] = data.data || [];

      // Apply inbox filter client-side (only open & in_progress)
      if (viewMode === 'inbox' && activeTab === 'all') {
        fetchedTickets = fetchedTickets.filter(
          (t) => t.status === 'open' || t.status === 'in_progress'
        );
      }

      setTickets(fetchedTickets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 10000);
    return () => clearInterval(interval);
  }, [activeTab, filters, categoryFilter, viewMode]);

  const stats = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    urgent: tickets.filter((t) => t.priority === 'urgent').length,
  };

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: stats.all },
    { id: 'open', label: 'Open', count: stats.open },
    { id: 'in_progress', label: 'In Progress', count: stats.inProgress },
    { id: 'resolved', label: 'Resolved', count: stats.resolved },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Stats Bar - Linear style */}
      <div className="flex items-center gap-6 border-b border-[var(--linear-border)] px-6 py-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-[var(--linear-text-muted)]">Total</span>
          <span className="font-semibold text-[var(--linear-text-primary)]">{stats.all}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--status-open)]" />
          <span className="text-[var(--linear-text-muted)]">Open</span>
          <span className="font-semibold text-[var(--linear-text-primary)]">{stats.open}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--status-in-progress)]" />
          <span className="text-[var(--linear-text-muted)]">In Progress</span>
          <span className="font-semibold text-[var(--linear-text-primary)]">{stats.inProgress}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--status-resolved)]" />
          <span className="text-[var(--linear-text-muted)]">Resolved</span>
          <span className="font-semibold text-[var(--linear-text-primary)]">{stats.resolved}</span>
        </div>
        {stats.urgent > 0 && (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--status-urgent)] animate-pulse" />
            <span className="text-[var(--linear-text-muted)]">Urgent</span>
            <span className="font-semibold text-red-400">{stats.urgent}</span>
          </div>
        )}
        <div className="ml-auto">
          <button
            onClick={fetchTickets}
            disabled={isLoading}
            className="rounded p-1 text-[var(--linear-text-muted)] hover:bg-[var(--linear-bg-tertiary)] hover:text-[var(--linear-text-primary)] transition-colors disabled:opacity-50"
            aria-label="Refresh tickets"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs - Linear pill style */}
      <div className="flex items-center gap-1 border-b border-[var(--linear-border)] px-6 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pill-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-[var(--linear-text-muted)]">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Ticket Rows */}
      <div className="flex-1 overflow-y-auto">
        {error ? (
          <div className="m-6 rounded-md bg-red-500/10 p-4 text-sm text-red-400" role="alert">
            {error}
          </div>
        ) : isLoading && tickets.length === 0 ? (
          <div className="space-y-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 border-b border-[var(--linear-border)] px-4 py-3"
              >
                <div className="h-4 w-4 animate-pulse rounded-full bg-[var(--linear-bg-tertiary)]" />
                <div className="h-4 w-16 animate-pulse rounded bg-[var(--linear-bg-tertiary)]" />
                <div className="h-4 flex-1 animate-pulse rounded bg-[var(--linear-bg-tertiary)]" />
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-[var(--linear-bg-tertiary)] p-4">
              <Filter className="h-8 w-8 text-[var(--linear-text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--linear-text-primary)]">
              No tickets found
            </h3>
            <p className="mt-1 text-sm text-[var(--linear-text-secondary)]">
              {activeTab === 'all'
                ? 'Submit your first ticket to get started!'
                : `No ${activeTab.replace('_', ' ')} tickets at the moment.`}
            </p>
          </div>
        ) : (
          <div role="list">
            {tickets.map((ticket) => (
              <div key={ticket.id} role="listitem">
                <TicketRow ticket={ticket} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
