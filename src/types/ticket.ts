export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'billing' | 'technical' | 'general' | 'feature-request';

export interface Ticket {
  id: string;
  name: string;
  email: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  status: TicketStatus;
  aiCategory?: string;
  aiConfidence?: number;
  aiSuggestedPriority?: TicketPriority;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketInput {
  name: string;
  email: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
}

export interface TriageResult {
  category: TicketCategory;
  confidence: number;
  suggestedPriority: TicketPriority;
  reasoning: string;
}

export const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bgColor: string }> = {
  open: { label: 'Open', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  in_progress: { label: 'In Progress', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  resolved: { label: 'Resolved', color: 'text-green-700', bgColor: 'bg-green-100' },
  closed: { label: 'Closed', color: 'text-gray-600', bgColor: 'bg-gray-100' },
};

export const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Low', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  medium: { label: 'Medium', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  high: { label: 'High', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  urgent: { label: 'Urgent', color: 'text-red-700', bgColor: 'bg-red-100' },
};

export const CATEGORY_CONFIG: Record<TicketCategory, { label: string; icon: string }> = {
  billing: { label: 'Billing', icon: '💳' },
  technical: { label: 'Technical', icon: '🔧' },
  general: { label: 'General', icon: '📋' },
  'feature-request': { label: 'Feature Request', icon: '💡' },
};
