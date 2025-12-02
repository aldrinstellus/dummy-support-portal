'use client';

import { useState } from 'react';
import { PanelLeft, PanelLeftClose } from 'lucide-react';
import { TicketForm, TicketList } from '@/components/tickets';
import { Sidebar, ViewType } from '@/components/layout';
import { Dashboard } from '@/components/dashboard';
import { Settings } from '@/components/settings';
import { Help } from '@/components/help';
import { ThemeProvider } from '@/components/providers';
import { TicketCategory } from '@/types/ticket';

type ModeType = 'list' | 'submit';

function HomeContent() {
  const [activeView, setActiveView] = useState<ViewType>('my-tickets');
  const [mode, setMode] = useState<ModeType>('list');
  const [refreshKey, setRefreshKey] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleTicketSubmitted = () => {
    setMode('list');
    setRefreshKey((prev) => prev + 1);
  };

  const handleNewTicket = () => {
    setMode('submit');
  };

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    setMode('list');
    // Clear category filter when switching views (except when staying on all-tickets)
    if (view !== 'all-tickets') {
      setCategoryFilter(null);
    }
  };

  const handleCategoryFilter = (category: TicketCategory | null) => {
    setCategoryFilter(category);
  };

  const getViewTitle = () => {
    if (categoryFilter) {
      const categoryLabels: Record<TicketCategory, string> = {
        technical: 'Technical',
        billing: 'Billing',
        'feature-request': 'Feature Request',
        general: 'General',
      };
      return `${categoryLabels[categoryFilter]} Tickets`;
    }

    switch (activeView) {
      case 'inbox':
        return 'Inbox';
      case 'my-tickets':
        return 'My Tickets';
      case 'all-tickets':
        return 'All Tickets';
      case 'dashboard':
        return 'Dashboard';
      case 'settings':
        return 'Settings';
      case 'help':
        return 'Help';
    }
  };

  const getViewMode = (): 'all' | 'inbox' | 'my-tickets' => {
    if (activeView === 'inbox') return 'inbox';
    if (activeView === 'my-tickets') return 'my-tickets';
    return 'all';
  };

  const renderMainContent = () => {
    // Handle form submission mode
    if (mode === 'submit') {
      return (
        <div className="h-full overflow-y-auto">
          {/* Submit Header */}
          <div className="sticky top-0 z-10 border-b border-[var(--linear-border)] bg-[var(--linear-bg-primary)] px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMode('list')}
                className="text-[var(--linear-text-secondary)] hover:text-[var(--linear-text-primary)] transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-xl font-semibold text-[var(--linear-text-primary)]">
                New Ticket
              </h1>
            </div>
          </div>
          {/* Form */}
          <div className="p-6">
            <div className="max-w-2xl">
              <TicketForm onSuccess={handleTicketSubmitted} />
            </div>
          </div>
        </div>
      );
    }

    // Handle special views
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      default:
        // Ticket list views (inbox, my-tickets, all-tickets)
        return (
          <div className="flex h-full flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-[var(--linear-border)] px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="rounded p-1.5 text-[var(--linear-text-secondary)] hover:bg-[var(--linear-bg-tertiary)] hover:text-[var(--linear-text-primary)] transition-colors"
                  title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {sidebarCollapsed ? (
                    <PanelLeft className="h-5 w-5" />
                  ) : (
                    <PanelLeftClose className="h-5 w-5" />
                  )}
                </button>
                <h1 className="text-xl font-semibold text-[var(--linear-text-primary)]">
                  {getViewTitle()}
                </h1>
                {categoryFilter && (
                  <button
                    onClick={() => setCategoryFilter(null)}
                    className="rounded-full bg-[var(--linear-bg-tertiary)] px-2 py-0.5 text-xs text-[var(--linear-text-secondary)] hover:bg-[var(--linear-border-medium)] transition-colors"
                  >
                    × Clear filter
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-md px-3 py-1.5 text-sm text-[var(--linear-text-secondary)] hover:bg-[var(--linear-bg-tertiary)] hover:text-[var(--linear-text-primary)] transition-colors">
                  Filter
                </button>
                <button className="rounded-md px-3 py-1.5 text-sm text-[var(--linear-text-secondary)] hover:bg-[var(--linear-bg-tertiary)] hover:text-[var(--linear-text-primary)] transition-colors">
                  Display
                </button>
              </div>
            </header>

            {/* Ticket List */}
            <div className="flex-1 overflow-y-auto">
              <TicketList
                key={`${refreshKey}-${categoryFilter || 'all'}-${activeView}`}
                categoryFilter={categoryFilter}
                viewMode={getViewMode()}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--linear-bg-primary)]">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        onNewTicket={handleNewTicket}
        activeCategory={categoryFilter}
        onCategoryFilter={handleCategoryFilter}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">{renderMainContent()}</main>
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
