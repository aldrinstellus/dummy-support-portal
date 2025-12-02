import { render, screen } from '@testing-library/react';
import { TicketCard } from '@/components/tickets/TicketCard';
import { Ticket } from '@/types/ticket';

const mockTicket: Ticket = {
  id: 'test-001',
  name: 'John Doe',
  email: 'john@example.com',
  category: 'technical',
  priority: 'high',
  description: 'Test description for the ticket that should be displayed.',
  status: 'open',
  aiCategory: 'technical',
  aiConfidence: 0.95,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('TicketCard', () => {
  it('renders ticket information correctly', () => {
    render(<TicketCard ticket={mockTicket} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Test description/)).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<TicketCard ticket={mockTicket} />);

    // Multiple status elements (StatusBadge and PriorityBadge)
    expect(screen.getAllByRole('status').length).toBeGreaterThanOrEqual(1);
  });

  it('renders priority badge', () => {
    render(<TicketCard ticket={mockTicket} />);

    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders category with icon', () => {
    render(<TicketCard ticket={mockTicket} />);

    expect(screen.getByText('Technical')).toBeInTheDocument();
  });

  it('renders AI triage information when available', () => {
    render(<TicketCard ticket={mockTicket} />);

    expect(screen.getByText('AI Triage:')).toBeInTheDocument();
    expect(screen.getByText('technical')).toBeInTheDocument();
    expect(screen.getByText(/95/)).toBeInTheDocument();
    expect(screen.getByText(/confidence/)).toBeInTheDocument();
  });

  it('does not render AI triage when not available', () => {
    const ticketWithoutAI = { ...mockTicket, aiCategory: undefined, aiConfidence: undefined };
    render(<TicketCard ticket={ticketWithoutAI} />);

    expect(screen.queryByText('AI Triage:')).not.toBeInTheDocument();
  });

  it('has accessible article role', () => {
    render(<TicketCard ticket={mockTicket} />);

    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('has descriptive aria-label', () => {
    render(<TicketCard ticket={mockTicket} />);

    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-label', expect.stringContaining('John Doe'));
  });
});
