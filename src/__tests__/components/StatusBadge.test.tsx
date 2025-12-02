import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/tickets/StatusBadge';

describe('StatusBadge', () => {
  it('renders open status with correct styling', () => {
    render(<StatusBadge status="open" />);

    const badge = screen.getByText('Open');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100');
  });

  it('renders in_progress status with correct label', () => {
    render(<StatusBadge status="in_progress" />);

    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders resolved status with correct styling', () => {
    render(<StatusBadge status="resolved" />);

    const badge = screen.getByText('Resolved');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100');
  });

  it('renders closed status with correct styling', () => {
    render(<StatusBadge status="closed" />);

    const badge = screen.getByText('Closed');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100');
  });

  it('has accessible role attribute', () => {
    render(<StatusBadge status="open" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-label for screen readers', () => {
    render(<StatusBadge status="open" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Status: Open');
  });
});
