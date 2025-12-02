'use client';

import {
  Inbox,
  Ticket,
  FolderKanban,
  LayoutGrid,
  ChevronDown,
  Search,
  Plus,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useTheme } from '@/components/providers';
import { TicketCategory } from '@/types/ticket';

export type ViewType = 'inbox' | 'my-tickets' | 'all-tickets' | 'dashboard' | 'settings' | 'help';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onNewTicket: () => void;
  activeCategory?: TicketCategory | null;
  onCategoryFilter?: (category: TicketCategory | null) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const CATEGORY_COLORS: Record<TicketCategory, string> = {
  technical: 'bg-blue-500',
  billing: 'bg-green-500',
  'feature-request': 'bg-purple-500',
  general: 'bg-gray-500',
};

const CATEGORY_LABELS: Record<TicketCategory, string> = {
  technical: 'Technical',
  billing: 'Billing',
  'feature-request': 'Feature Request',
  general: 'General',
};

export function Sidebar({
  activeView,
  onViewChange,
  onNewTicket,
  activeCategory,
  onCategoryFilter,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  const handleCategoryClick = (category: TicketCategory) => {
    if (onCategoryFilter) {
      if (activeCategory === category) {
        onCategoryFilter(null);
      } else {
        onCategoryFilter(category);
        if (activeView !== 'all-tickets') {
          onViewChange('all-tickets');
        }
      }
    }
  };

  return (
    <aside
      className={`flex h-screen flex-col bg-[var(--linear-bg-secondary)] border-r border-[var(--linear-border)] transition-all duration-300 ${
        isCollapsed ? 'w-[68px]' : 'w-[280px]'
      }`}
    >
      {/* Logo and Controls */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3`}>
        <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-[var(--linear-accent)] text-white text-xs font-bold">
            SP
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-[var(--linear-text-primary)]">Support Portal</span>
          )}
        </div>
        {!isCollapsed && (
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="rounded p-1.5 text-[var(--linear-text-secondary)] hover:bg-[var(--linear-bg-tertiary)] hover:text-[var(--linear-text-primary)] transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              className="rounded p-1.5 text-[var(--linear-text-secondary)] hover:bg-[var(--linear-bg-tertiary)] hover:text-[var(--linear-text-primary)] transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* New Ticket Button */}
      <div className={`${isCollapsed ? 'px-2' : 'px-3'} py-2`}>
        <button
          onClick={onNewTicket}
          className={`flex items-center gap-2 rounded-md bg-[var(--linear-accent)] py-1.5 text-sm font-medium text-white hover:bg-[var(--linear-accent-hover)] transition-colors ${
            isCollapsed ? 'w-full justify-center px-2' : 'w-full px-3'
          }`}
          title={isCollapsed ? 'New Ticket' : undefined}
        >
          <Plus className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>New Ticket</span>}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-2'} py-2`}>
        {/* Core Views */}
        <div className="space-y-0.5">
          <button
            onClick={() => onViewChange('inbox')}
            className={`sidebar-item w-full ${activeView === 'inbox' ? 'active' : ''} ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title={isCollapsed ? 'Inbox' : undefined}
          >
            <Inbox className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Inbox</span>}
          </button>
          <button
            onClick={() => onViewChange('my-tickets')}
            className={`sidebar-item w-full ${activeView === 'my-tickets' ? 'active' : ''} ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title={isCollapsed ? 'My Tickets' : undefined}
          >
            <Ticket className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>My Tickets</span>}
          </button>
        </div>

        {/* Workspace Section */}
        <div className="mt-6">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--linear-text-muted)]">
                Workspace
              </span>
              <ChevronDown className="h-3 w-3 text-[var(--linear-text-muted)]" />
            </div>
          )}
          <div className={`${isCollapsed ? '' : 'mt-1'} space-y-0.5`}>
            <button
              onClick={() => onViewChange('all-tickets')}
              className={`sidebar-item w-full ${activeView === 'all-tickets' ? 'active' : ''} ${
                isCollapsed ? 'justify-center px-2' : ''
              }`}
              title={isCollapsed ? 'All Tickets' : undefined}
            >
              <FolderKanban className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>All Tickets</span>}
            </button>
            <button
              onClick={() => onViewChange('dashboard')}
              className={`sidebar-item w-full ${activeView === 'dashboard' ? 'active' : ''} ${
                isCollapsed ? 'justify-center px-2' : ''
              }`}
              title={isCollapsed ? 'Dashboard' : undefined}
            >
              <LayoutGrid className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-6">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--linear-text-muted)]">
                Categories
              </span>
              <ChevronDown className="h-3 w-3 text-[var(--linear-text-muted)]" />
            </div>
          )}
          <div className={`${isCollapsed ? '' : 'mt-1'} space-y-0.5`}>
            {(Object.keys(CATEGORY_COLORS) as TicketCategory[]).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`sidebar-item w-full ${activeCategory === category ? 'active' : ''} ${
                  isCollapsed ? 'justify-center px-2' : ''
                }`}
                title={isCollapsed ? CATEGORY_LABELS[category] : undefined}
              >
                <span className={`h-2 w-2 flex-shrink-0 rounded-full ${CATEGORY_COLORS[category]}`} />
                {!isCollapsed && <span>{CATEGORY_LABELS[category]}</span>}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[var(--linear-border)] px-2 py-2">
        <button
          onClick={() => onViewChange('settings')}
          className={`sidebar-item w-full ${activeView === 'settings' ? 'active' : ''} ${
            isCollapsed ? 'justify-center px-2' : ''
          }`}
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </button>
        <button
          onClick={() => onViewChange('help')}
          className={`sidebar-item w-full ${activeView === 'help' ? 'active' : ''} ${
            isCollapsed ? 'justify-center px-2' : ''
          }`}
          title={isCollapsed ? 'Help' : undefined}
        >
          <HelpCircle className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Help</span>}
        </button>

        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className={`sidebar-item w-full mt-1 ${isCollapsed ? 'justify-center px-2' : ''}`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4 flex-shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 flex-shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
