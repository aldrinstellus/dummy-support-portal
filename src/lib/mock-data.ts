import { Ticket } from '@/types/ticket';

export const mockTickets: Ticket[] = [
  {
    id: 'ticket-001',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    category: 'billing',
    priority: 'high',
    description: 'I was charged twice for my subscription this month. Order #12345. Please help resolve this as soon as possible.',
    status: 'open',
    aiCategory: 'billing',
    aiConfidence: 0.95,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ticket-002',
    name: 'Mike Chen',
    email: 'mike@example.com',
    category: 'technical',
    priority: 'urgent',
    description: 'Cannot login to my account. Getting "Invalid credentials" error even after password reset. This is blocking my work.',
    status: 'in_progress',
    aiCategory: 'technical',
    aiConfidence: 0.92,
    aiSuggestedPriority: 'urgent',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'ticket-003',
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    category: 'feature-request',
    priority: 'medium',
    description: 'Would love to see dark mode support in the mobile app. Many users prefer working in low-light environments.',
    status: 'open',
    aiCategory: 'feature-request',
    aiConfidence: 0.88,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ticket-004',
    name: 'James Wilson',
    email: 'james@example.com',
    category: 'technical',
    priority: 'high',
    description: 'The export function is not working properly. CSV files are coming out corrupted when exporting large datasets.',
    status: 'in_progress',
    aiCategory: 'technical',
    aiConfidence: 0.91,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ticket-005',
    name: 'Lisa Park',
    email: 'lisa@example.com',
    category: 'general',
    priority: 'low',
    description: 'Just wanted to say thank you for the great customer service I received last week. Keep up the good work!',
    status: 'resolved',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ticket-006',
    name: 'David Kim',
    email: 'david@example.com',
    category: 'billing',
    priority: 'medium',
    description: 'Need to update my payment method. The current card on file has expired. How do I change this?',
    status: 'resolved',
    aiCategory: 'billing',
    aiConfidence: 0.89,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'ticket-007',
    name: 'Anna Martinez',
    email: 'anna@example.com',
    category: 'technical',
    priority: 'urgent',
    description: 'Production server is down! All our users are affected. This is a critical issue that needs immediate attention.',
    status: 'open',
    aiCategory: 'technical',
    aiConfidence: 0.97,
    aiSuggestedPriority: 'urgent',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'ticket-008',
    name: 'Robert Taylor',
    email: 'robert@example.com',
    category: 'feature-request',
    priority: 'low',
    description: 'It would be nice to have keyboard shortcuts for common actions. This would improve productivity significantly.',
    status: 'closed',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
];

export function getMockTickets(filters?: {
  status?: string;
  priority?: string;
  category?: string;
}): Ticket[] {
  let filtered = [...mockTickets];

  if (filters?.status) {
    filtered = filtered.filter((t) => t.status === filters.status);
  }
  if (filters?.priority) {
    filtered = filtered.filter((t) => t.priority === filters.priority);
  }
  if (filters?.category) {
    filtered = filtered.filter((t) => t.category === filters.category);
  }

  return filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
