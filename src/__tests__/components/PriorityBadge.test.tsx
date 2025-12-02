import { render, screen } from '@testing-library/react';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';

describe('PriorityBadge', () => {
  it('renders low priority with correct styling', () => {
    render(<PriorityBadge priority="low" />);

    const badge = screen.getByText('Low');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100');
  });

  it('renders medium priority with correct styling', () => {
    render(<PriorityBadge priority="medium" />);

    const badge = screen.getByText('Medium');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100');
  });

  it('renders high priority with correct styling', () => {
    render(<PriorityBadge priority="high" />);

    const badge = screen.getByText('High');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-orange-100');
  });

  it('renders urgent priority with animation', () => {
    render(<PriorityBadge priority="urgent" />);

    const badge = screen.getByText(/Urgent/);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('animate-pulse');
    expect(badge).toHaveClass('bg-red-100');
  });

  it('urgent priority includes exclamation mark', () => {
    render(<PriorityBadge priority="urgent" />);

    // The exclamation mark is in a separate span with aria-hidden
    expect(screen.getByText('!')).toBeInTheDocument();
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });

  it('has accessible aria-label', () => {
    render(<PriorityBadge priority="high" />);

    expect(screen.getByText('High')).toHaveAttribute('aria-label', 'Priority: High');
  });
});
