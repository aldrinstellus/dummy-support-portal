'use client';

import { useState } from 'react';
import { useTheme } from '@/components/providers';
import { Sun, Moon, Bell, BellOff, User, Info, Check } from 'lucide-react';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    ticketUpdates: true,
    newAssignments: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--linear-text-primary)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--linear-text-secondary)]">
          Manage your account preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Section */}
        <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-5">
          <div className="mb-4 flex items-center gap-3">
            <User className="h-5 w-5 text-[var(--linear-text-secondary)]" />
            <h2 className="text-lg font-semibold text-[var(--linear-text-primary)]">Profile</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--linear-accent)] text-2xl font-bold text-white">
                JD
              </div>
              <div>
                <p className="font-medium text-[var(--linear-text-primary)]">John Doe</p>
                <p className="text-sm text-[var(--linear-text-secondary)]">john.doe@example.com</p>
                <p className="text-xs text-[var(--linear-text-muted)]">Support Agent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-5">
          <div className="mb-4 flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="h-5 w-5 text-[var(--linear-text-secondary)]" />
            ) : (
              <Sun className="h-5 w-5 text-[var(--linear-text-secondary)]" />
            )}
            <h2 className="text-lg font-semibold text-[var(--linear-text-primary)]">Appearance</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-[var(--linear-text-secondary)]">
              Choose your preferred theme
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                  theme === 'light'
                    ? 'border-[var(--linear-accent)] bg-[var(--linear-accent)]/10'
                    : 'border-[var(--linear-border)] hover:border-[var(--linear-border-medium)]'
                }`}
              >
                <Sun className="h-6 w-6 text-yellow-500" />
                <span className="text-sm font-medium text-[var(--linear-text-primary)]">Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                  theme === 'dark'
                    ? 'border-[var(--linear-accent)] bg-[var(--linear-accent)]/10'
                    : 'border-[var(--linear-border)] hover:border-[var(--linear-border-medium)]'
                }`}
              >
                <Moon className="h-6 w-6 text-blue-400" />
                <span className="text-sm font-medium text-[var(--linear-text-primary)]">Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-5">
          <div className="mb-4 flex items-center gap-3">
            <Bell className="h-5 w-5 text-[var(--linear-text-secondary)]" />
            <h2 className="text-lg font-semibold text-[var(--linear-text-primary)]">
              Notifications
            </h2>
          </div>
          <div className="space-y-4">
            {Object.entries({
              email: 'Email notifications',
              push: 'Push notifications',
              ticketUpdates: 'Ticket status updates',
              newAssignments: 'New ticket assignments',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-[var(--linear-text-secondary)]">{label}</span>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      [key]: !prev[key as keyof typeof prev],
                    }))
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    notifications[key as keyof typeof notifications]
                      ? 'bg-[var(--linear-accent)]'
                      : 'bg-[var(--linear-bg-tertiary)]'
                  }`}
                  role="switch"
                  aria-checked={notifications[key as keyof typeof notifications]}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      notifications[key as keyof typeof notifications] ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-5">
          <div className="mb-4 flex items-center gap-3">
            <Info className="h-5 w-5 text-[var(--linear-text-secondary)]" />
            <h2 className="text-lg font-semibold text-[var(--linear-text-primary)]">About</h2>
          </div>
          <div className="space-y-2 text-sm text-[var(--linear-text-secondary)]">
            <p>
              <span className="text-[var(--linear-text-muted)]">Version:</span>{' '}
              <span className="text-[var(--linear-text-primary)]">1.0.0</span>
            </p>
            <p>
              <span className="text-[var(--linear-text-muted)]">Built with:</span>{' '}
              <span className="text-[var(--linear-text-primary)]">Justice League SDLC</span>
            </p>
            <p>
              <span className="text-[var(--linear-text-muted)]">UI Framework:</span>{' '}
              <span className="text-[var(--linear-text-primary)]">Next.js 15 + Tailwind CSS</span>
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-md bg-[var(--linear-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--linear-accent-hover)]"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
