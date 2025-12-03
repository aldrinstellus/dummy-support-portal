'use client';

import { useState, useEffect } from 'react';
import { TicketRow } from './TicketRow';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '@/types/ticket';
import {
  RefreshCw,
  Filter,
  Inbox,
  User,
  LayoutList,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock,
  Circle
} from 'lucide-react';

interface TicketListProps {
  initialTickets?: Ticket[];
  categoryFilter?: TicketCategory | null;
  viewMode?: 'all' | 'inbox' | 'my-tickets';
}

type TabType = 'all' | 'open' | 'in_progress' | 'resolved';

// View-specific header components
function InboxHeader({ stats, urgentCount }: { stats: { open: number; inProgress: number }; urgentCount: number }) {
  return (
    <div className="border-b border-[var(--linear-border)]">
      {/* Inbox Title with Icon */}
      <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500/5 to-orange-500/5">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/20">
          <Inbox className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--linear-text-primary)]">Inbox</h2>
          <p className="text-xs text-[var(--linear-text-muted)]">Tickets requiring your attention</p>
        </div>
      </div>

      {/* Urgent Alert Banner */}
      {urgentCount > 0 && (
        <div className="mx-4 my-3 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/30 animate-pulse">
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-400">
                {urgentCount} URGENT TICKET{urgentCount > 1 ? 'S' : ''} NEED{urgentCount === 1 ? 'S' : ''} ATTENTION
              </p>
              <p className="text-xs text-red-600 dark:text-red-300">High priority issues awaiting response</p>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-500/30 text-red-400 hover:bg-red-500/40 transition-colors">
              View Urgent
            </button>
          </div>
        </div>
      )}

      {/* Stats Pills */}
      <div className="flex items-center gap-4 px-6 py-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
          <Circle className="h-2.5 w-2.5 fill-blue-400 text-blue-400" />
          <span className="text-xs font-medium text-blue-600 dark:text-blue-300">Open</span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-300">{stats.open}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
          <Clock className="h-2.5 w-2.5 text-yellow-400" />
          <span className="text-xs font-medium text-yellow-600 dark:text-yellow-300">In Progress</span>
          <span className="text-xs font-bold text-yellow-600 dark:text-yellow-300">{stats.inProgress}</span>
        </div>
      </div>
    </div>
  );
}

function MyTicketsHeader({ stats }: { stats: { open: number; inProgress: number; resolved: number; all: number } }) {
  return (
    <div className="border-b border-[var(--linear-border)]">
      {/* Personal Dashboard Header */}
      <div className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-purple-500/5 to-indigo-500/5">
        {/* User Avatar */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-purple-500/20">
          JD
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-[var(--linear-text-primary)]">Welcome back!</h2>
          <p className="text-sm text-[var(--linear-text-secondary)]">
            You have <span className="font-semibold text-purple-400">{stats.open}</span> open ticket{stats.open !== 1 ? 's' : ''} assigned to you
          </p>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-medium text-purple-400">My Tickets</span>
        </div>
      </div>

      {/* Personal Stats Cards */}
      <div className="grid grid-cols-3 gap-3 px-6 py-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20">
            <Circle className="h-4 w-4 fill-purple-400 text-purple-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-300">{stats.open}</p>
            <p className="text-xs text-purple-600 dark:text-purple-300">Open</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20">
            <Clock className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-300">{stats.inProgress}</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-300">In Progress</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/20">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-green-600 dark:text-green-300">{stats.resolved}</p>
            <p className="text-xs text-green-600 dark:text-green-300">Resolved</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AllTicketsHeader({ stats }: { stats: { all: number; open: number; inProgress: number; resolved: number } }) {
  const resolvedPercentage = stats.all > 0 ? Math.round((stats.resolved / stats.all) * 100) : 0;

  return (
    <div className="border-b border-[var(--linear-border)]">
      {/* Team Overview Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-teal-500/5 to-cyan-500/5">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-500/20">
          <LayoutList className="h-5 w-5 text-teal-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-[var(--linear-text-primary)]">All Tickets</h2>
          <p className="text-xs text-[var(--linear-text-muted)]">Team Overview - Complete ticket queue</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
          <TrendingUp className="h-3.5 w-3.5 text-teal-400" />
          <span className="text-xs font-medium text-teal-400">{resolvedPercentage}% resolved</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-4 gap-3 px-6 py-4">
        <div className="flex flex-col items-center p-3 rounded-lg bg-[var(--linear-bg-tertiary)] border border-[var(--linear-border)]">
          <TrendingUp className="h-4 w-4 text-teal-400 mb-1" />
          <p className="text-xl font-bold text-[var(--linear-text-primary)]">{stats.all}</p>
          <p className="text-xs text-[var(--linear-text-muted)]">Total</p>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
          <Circle className="h-4 w-4 fill-blue-400 text-blue-400 mb-1" />
          <p className="text-xl font-bold text-blue-600 dark:text-blue-300">{stats.open}</p>
          <p className="text-xs text-blue-600 dark:text-blue-300">Open</p>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
          <Clock className="h-4 w-4 text-yellow-400 mb-1" />
          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-300">{stats.inProgress}</p>
          <p className="text-xs text-yellow-600 dark:text-yellow-300">In Progress</p>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg bg-green-500/5 border border-green-500/20">
          <CheckCircle2 className="h-4 w-4 text-green-400 mb-1" />
          <p className="text-xl font-bold text-green-600 dark:text-green-300">{stats.resolved}</p>
          <p className="text-xs text-green-600 dark:text-green-300">Resolved</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-[var(--linear-text-muted)]">Resolution Progress</span>
          <span className="text-xs font-medium text-teal-400">{resolvedPercentage}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--linear-bg-tertiary)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${resolvedPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-[var(--linear-text-muted)]">{stats.resolved} resolved</span>
          <span className="text-xs text-[var(--linear-text-muted)]">{stats.all - stats.resolved} remaining</span>
        </div>
      </div>
    </div>
  );
}

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

      // Apply "my-tickets" filter - simulates user-specific tickets
      // In a real app, this would filter by user ID. For demo, we show tickets
      // that are either assigned to the user OR created by them (odd IDs for demo)
      if (viewMode === 'my-tickets') {
        fetchedTickets = fetchedTickets.filter((t) => {
          // For demo: show tickets with odd numbers (001, 003, 005, 007, 009)
          // This simulates "your" tickets vs "all" tickets
          const ticketNum = parseInt(t.id.replace(/\D/g, ''), 10);
          return ticketNum % 2 === 1;
        });
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

  // Get view-specific border class for ticket rows
  const getViewAccentClass = () => {
    switch (viewMode) {
      case 'inbox':
        return 'inbox-view';
      case 'my-tickets':
        return 'my-tickets-view';
      default:
        return 'all-tickets-view';
    }
  };

  return (
    <div className={`flex h-full flex-col ${getViewAccentClass()}`}>
      {/* View-Specific Header */}
      {viewMode === 'inbox' && (
        <InboxHeader
          stats={{ open: stats.open, inProgress: stats.inProgress }}
          urgentCount={stats.urgent}
        />
      )}
      {viewMode === 'my-tickets' && (
        <MyTicketsHeader stats={stats} />
      )}
      {viewMode === 'all' && (
        <AllTicketsHeader stats={stats} />
      )}

      {/* Tabs - Linear pill style with refresh button */}
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
                <TicketRow ticket={ticket} viewMode={viewMode} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
