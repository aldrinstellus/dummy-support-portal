'use client';

import { useState } from 'react';
import { ChevronDown, Keyboard, Mail, BookOpen, ExternalLink } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I create a new ticket?',
    answer:
      'Click the "New Ticket" button in the sidebar or use the keyboard shortcut Cmd/Ctrl + N. Fill out the form with your details and click Submit.',
  },
  {
    question: 'How are tickets prioritized?',
    answer:
      'Tickets can be set to Low, Medium, High, or Urgent priority. Our AI triage system also analyzes tickets and suggests appropriate priority levels based on content.',
  },
  {
    question: 'How long does it take to get a response?',
    answer:
      'Response times vary by priority: Urgent tickets within 1 hour, High priority within 4 hours, Medium within 24 hours, and Low priority within 48 hours.',
  },
  {
    question: 'Can I track the status of my ticket?',
    answer:
      'Yes! Navigate to "My Tickets" in the sidebar to see all your submitted tickets and their current status (Open, In Progress, Resolved, or Closed).',
  },
  {
    question: 'How does the AI triage work?',
    answer:
      'Our AI analyzes your ticket description to automatically categorize it and suggest a priority level. This helps route your ticket to the right team faster.',
  },
];

const shortcuts = [
  { keys: ['Cmd/Ctrl', 'N'], description: 'New ticket' },
  { keys: ['Cmd/Ctrl', 'K'], description: 'Search' },
  { keys: ['Cmd/Ctrl', '/'], description: 'Toggle sidebar' },
  { keys: ['Cmd/Ctrl', 'D'], description: 'Go to Dashboard' },
  { keys: ['Esc'], description: 'Close modal/dialog' },
];

export function Help() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--linear-text-primary)]">Help Center</h1>
        <p className="mt-1 text-sm text-[var(--linear-text-secondary)]">
          Find answers and learn how to use the Support Portal
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* FAQ Section */}
        <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-5">
          <div className="mb-4 flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-[var(--linear-text-secondary)]" />
            <h2 className="text-lg font-semibold text-[var(--linear-text-primary)]">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-md border border-[var(--linear-border)] bg-[var(--linear-bg-primary)]"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-medium text-[var(--linear-text-primary)]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-[var(--linear-text-muted)] transition-transform ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFAQ === index && (
                  <div className="border-t border-[var(--linear-border)] px-4 py-3">
                    <p className="text-sm text-[var(--linear-text-secondary)]">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-5">
          <div className="mb-4 flex items-center gap-3">
            <Keyboard className="h-5 w-5 text-[var(--linear-text-secondary)]" />
            <h2 className="text-lg font-semibold text-[var(--linear-text-primary)]">
              Keyboard Shortcuts
            </h2>
          </div>
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-[var(--linear-text-secondary)]">
                  {shortcut.description}
                </span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <span key={keyIndex}>
                      <kbd className="rounded border border-[var(--linear-border)] bg-[var(--linear-bg-primary)] px-2 py-0.5 text-xs font-mono text-[var(--linear-text-primary)]">
                        {key}
                      </kbd>
                      {keyIndex < shortcut.keys.length - 1 && (
                        <span className="mx-1 text-[var(--linear-text-muted)]">+</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-5">
          <div className="mb-4 flex items-center gap-3">
            <Mail className="h-5 w-5 text-[var(--linear-text-secondary)]" />
            <h2 className="text-lg font-semibold text-[var(--linear-text-primary)]">
              Contact Support
            </h2>
          </div>
          <p className="mb-4 text-sm text-[var(--linear-text-secondary)]">
            Can&apos;t find what you&apos;re looking for? Reach out to our support team.
          </p>
          <div className="space-y-3">
            <a
              href="mailto:support@example.com"
              className="flex items-center gap-2 text-sm text-[var(--linear-accent)] hover:underline"
            >
              <Mail className="h-4 w-4" />
              support@example.com
            </a>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-5">
          <div className="mb-4 flex items-center gap-3">
            <ExternalLink className="h-5 w-5 text-[var(--linear-text-secondary)]" />
            <h2 className="text-lg font-semibold text-[var(--linear-text-primary)]">
              Documentation
            </h2>
          </div>
          <div className="space-y-2">
            <a
              href="#"
              className="flex items-center justify-between rounded-md border border-[var(--linear-border)] bg-[var(--linear-bg-primary)] px-4 py-3 transition-colors hover:bg-[var(--linear-bg-hover)]"
            >
              <span className="text-sm text-[var(--linear-text-primary)]">Getting Started Guide</span>
              <ExternalLink className="h-4 w-4 text-[var(--linear-text-muted)]" />
            </a>
            <a
              href="#"
              className="flex items-center justify-between rounded-md border border-[var(--linear-border)] bg-[var(--linear-bg-primary)] px-4 py-3 transition-colors hover:bg-[var(--linear-bg-hover)]"
            >
              <span className="text-sm text-[var(--linear-text-primary)]">API Documentation</span>
              <ExternalLink className="h-4 w-4 text-[var(--linear-text-muted)]" />
            </a>
            <a
              href="#"
              className="flex items-center justify-between rounded-md border border-[var(--linear-border)] bg-[var(--linear-bg-primary)] px-4 py-3 transition-colors hover:bg-[var(--linear-bg-hover)]"
            >
              <span className="text-sm text-[var(--linear-text-primary)]">Best Practices</span>
              <ExternalLink className="h-4 w-4 text-[var(--linear-text-muted)]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
