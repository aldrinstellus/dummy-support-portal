import { ticketSchema } from '@/lib/validations/ticket';

describe('ticketSchema', () => {
  it('validates a valid ticket', () => {
    const validTicket = {
      name: 'John Doe',
      email: 'john@example.com',
      category: 'technical',
      priority: 'high',
      description: 'This is a valid description with enough characters.',
    };

    const result = ticketSchema.safeParse(validTicket);
    expect(result.success).toBe(true);
  });

  it('rejects name shorter than 2 characters', () => {
    const invalidTicket = {
      name: 'J',
      email: 'john@example.com',
      category: 'technical',
      priority: 'high',
      description: 'This is a valid description.',
    };

    const result = ticketSchema.safeParse(invalidTicket);
    expect(result.success).toBe(false);
  });

  it('rejects invalid email format', () => {
    const invalidTicket = {
      name: 'John Doe',
      email: 'not-an-email',
      category: 'technical',
      priority: 'high',
      description: 'This is a valid description.',
    };

    const result = ticketSchema.safeParse(invalidTicket);
    expect(result.success).toBe(false);
  });

  it('rejects invalid category', () => {
    const invalidTicket = {
      name: 'John Doe',
      email: 'john@example.com',
      category: 'invalid-category',
      priority: 'high',
      description: 'This is a valid description.',
    };

    const result = ticketSchema.safeParse(invalidTicket);
    expect(result.success).toBe(false);
  });

  it('rejects invalid priority', () => {
    const invalidTicket = {
      name: 'John Doe',
      email: 'john@example.com',
      category: 'technical',
      priority: 'super-urgent',
      description: 'This is a valid description.',
    };

    const result = ticketSchema.safeParse(invalidTicket);
    expect(result.success).toBe(false);
  });

  it('rejects description shorter than 10 characters', () => {
    const invalidTicket = {
      name: 'John Doe',
      email: 'john@example.com',
      category: 'technical',
      priority: 'high',
      description: 'Short',
    };

    const result = ticketSchema.safeParse(invalidTicket);
    expect(result.success).toBe(false);
  });

  it('trims whitespace from name', () => {
    const ticket = {
      name: '  John Doe  ',
      email: 'john@example.com',
      category: 'technical',
      priority: 'high',
      description: 'This is a valid description.',
    };

    const result = ticketSchema.safeParse(ticket);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('John Doe');
    }
  });

  it('converts email to lowercase', () => {
    const ticket = {
      name: 'John Doe',
      email: 'JOHN@EXAMPLE.COM',
      category: 'technical',
      priority: 'high',
      description: 'This is a valid description.',
    };

    const result = ticketSchema.safeParse(ticket);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('john@example.com');
    }
  });

  it('accepts all valid categories', () => {
    const categories = ['billing', 'technical', 'general', 'feature-request'];

    categories.forEach((category) => {
      const ticket = {
        name: 'John Doe',
        email: 'john@example.com',
        category,
        priority: 'high',
        description: 'This is a valid description.',
      };

      const result = ticketSchema.safeParse(ticket);
      expect(result.success).toBe(true);
    });
  });

  it('accepts all valid priorities', () => {
    const priorities = ['low', 'medium', 'high', 'urgent'];

    priorities.forEach((priority) => {
      const ticket = {
        name: 'John Doe',
        email: 'john@example.com',
        category: 'technical',
        priority,
        description: 'This is a valid description.',
      };

      const result = ticketSchema.safeParse(ticket);
      expect(result.success).toBe(true);
    });
  });
});

