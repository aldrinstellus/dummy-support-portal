'use client';

import { useState, useEffect } from 'react';
import { Ticket, TicketStatus, TicketCategory } from '@/types/ticket';
import { AlertTriangle, CheckCircle2, Clock, Inbox, TrendingUp, Zap } from 'lucide-react';

interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  urgent: number;
  byCategory: Record<string, number>;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    urgent: 0,
    byCategory: {},
  });
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/tickets');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        const tickets: Ticket[] = data.data || [];

        const calculatedStats: DashboardStats = {
          total: tickets.length,
          open: tickets.filter((t) => t.status === 'open').length,
          inProgress: tickets.filter((t) => t.status === 'in_progress').length,
          resolved: tickets.filter((t) => t.status === 'resolved').length,
          closed: tickets.filter((t) => t.status === 'closed').length,
          urgent: tickets.filter((t) => t.priority === 'urgent').length,
          byCategory: tickets.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        };

        setStats(calculatedStats);
        setRecentTickets(tickets.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const categoryColors: Record<string, string> = {
    technical: 'bg-blue-500',
    billing: 'bg-green-500',
    'feature-request': 'bg-purple-500',
    general: 'bg-gray-500',
  };

  const categoryLabels: Record<string, string> = {
    technical: 'Technical',
    billing: 'Billing',
    'feature-request': 'Feature Request',
    general: 'General',
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--linear-accent)] border-t-transparent" />
      </div>
    );
  }

  const maxCategoryCount = Math.max(...Object.values(stats.byCategory), 1);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--linear-text-primary)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--linear-text-secondary)]">
          Overview of your support ticket activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <Inbox className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--linear-text-secondary)]">Total Tickets</p>
              <p className="text-2xl font-bold text-[var(--linear-text-primary)]">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-500/20 p-2">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--linear-text-secondary)]">In Progress</p>
              <p className="text-2xl font-bold text-[var(--linear-text-primary)]">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-500/20 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--linear-text-secondary)]">Resolved</p>
              <p className="text-2xl font-bold text-[var(--linear-text-primary)]">{stats.resolved}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-500/20 p-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--linear-text-secondary)]">Urgent</p>
              <p className="text-2xl font-bold text-red-400">{stats.urgent}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Distribution */}
        <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-5">
          <h2 className="mb-4 text-lg font-semibold text-[var(--linear-text-primary)]">
            By Category
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div key={category}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-[var(--linear-text-secondary)]">
                    {categoryLabels[category] || category}
                  </span>
                  <span className="font-medium text-[var(--linear-text-primary)]">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--linear-bg-tertiary)]">
                  <div
                    className={`h-full rounded-full transition-all ${categoryColors[category] || 'bg-gray-500'}`}
                    style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {Object.keys(stats.byCategory).length === 0 && (
              <p className="text-sm text-[var(--linear-text-muted)]">No tickets yet</p>
            )}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-5">
          <h2 className="mb-4 text-lg font-semibold text-[var(--linear-text-primary)]">
            Status Breakdown
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[var(--status-open)]" />
                <span className="text-sm text-[var(--linear-text-secondary)]">Open</span>
              </div>
              <span className="font-medium text-[var(--linear-text-primary)]">{stats.open}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[var(--status-in-progress)]" />
                <span className="text-sm text-[var(--linear-text-secondary)]">In Progress</span>
              </div>
              <span className="font-medium text-[var(--linear-text-primary)]">{stats.inProgress}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[var(--status-resolved)]" />
                <span className="text-sm text-[var(--linear-text-secondary)]">Resolved</span>
              </div>
              <span className="font-medium text-[var(--linear-text-primary)]">{stats.resolved}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[var(--status-closed)]" />
                <span className="text-sm text-[var(--linear-text-secondary)]">Closed</span>
              </div>
              <span className="font-medium text-[var(--linear-text-primary)]">{stats.closed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-5">
        <h2 className="mb-4 text-lg font-semibold text-[var(--linear-text-primary)]">
          Recent Tickets
        </h2>
        {recentTickets.length > 0 ? (
          <div className="space-y-3">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center gap-3 rounded-md border border-[var(--linear-border)] bg-[var(--linear-bg-primary)] p-3"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    ticket.status === 'open'
                      ? 'bg-[var(--status-open)]'
                      : ticket.status === 'in_progress'
                      ? 'bg-[var(--status-in-progress)]'
                      : ticket.status === 'resolved'
                      ? 'bg-[var(--status-resolved)]'
                      : 'bg-[var(--status-closed)]'
                  }`}
                />
                <span className="flex-1 truncate text-sm text-[var(--linear-text-primary)]">
                  {ticket.description}
                </span>
                <span className="text-xs text-[var(--linear-text-muted)]">
                  {ticket.category}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--linear-text-muted)]">No recent tickets</p>
        )}
      </div>
    </div>
  );
}
