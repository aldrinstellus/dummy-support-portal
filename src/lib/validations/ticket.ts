import { z } from 'zod';

export const ticketSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  category: z.enum(['billing', 'technical', 'general', 'feature-request'], {
    required_error: 'Please select a category',
  }),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    required_error: 'Please select a priority',
  }),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),
});

export const ticketFiltersSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.enum(['billing', 'technical', 'general', 'feature-request']).optional(),
});

export const updateTicketSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

export type TicketFormData = z.infer<typeof ticketSchema>;
export type TicketFiltersData = z.infer<typeof ticketFiltersSchema>;
export type UpdateTicketData = z.infer<typeof updateTicketSchema>;
