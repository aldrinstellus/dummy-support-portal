'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ticketSchema, type TicketFormData } from '@/lib/validations/ticket';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '@/types/ticket';

interface TicketFormProps {
  onSuccess?: () => void;
}

export function TicketForm({ onSuccess }: TicketFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  });

  const onSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit ticket');
      }

      setSubmitSuccess(true);
      reset();
      onSuccess?.();

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-[var(--linear-border)] bg-[var(--linear-bg-secondary)] p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--linear-text-primary)]">
          Submit a Support Ticket
        </h2>
        <p className="mt-1 text-sm text-[var(--linear-text-secondary)]">
          Fill out the form below and our team will get back to you as soon as possible.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {submitSuccess && (
          <div
            className="rounded-md bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-400"
            role="alert"
            data-testid="success-message"
          >
            Your ticket has been submitted successfully!
          </div>
        )}

        {submitError && (
          <div
            className="rounded-md bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400"
            role="alert"
          >
            {submitError}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[var(--linear-text-secondary)]">
              Name
            </Label>
            <Input
              id="name"
              data-testid="name-input"
              placeholder="Your name"
              {...register('name')}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className="border-[var(--linear-border)] bg-[var(--linear-bg-primary)] text-[var(--linear-text-primary)] placeholder:text-[var(--linear-text-muted)] focus:border-[var(--linear-accent)] focus:ring-[var(--linear-accent)]"
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-red-400" data-testid="name-error">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[var(--linear-text-secondary)]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              data-testid="email-input"
              placeholder="your@email.com"
              {...register('email')}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className="border-[var(--linear-border)] bg-[var(--linear-bg-primary)] text-[var(--linear-text-primary)] placeholder:text-[var(--linear-text-muted)] focus:border-[var(--linear-accent)] focus:ring-[var(--linear-accent)]"
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-400" data-testid="email-error">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-[var(--linear-text-secondary)]">
              Category
            </Label>
            <Select
              onValueChange={(value) => setValue('category', value as TicketFormData['category'])}
            >
              <SelectTrigger
                data-testid="category-select"
                aria-label="Select category"
                className="border-[var(--linear-border)] bg-[var(--linear-bg-primary)] text-[var(--linear-text-primary)]"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="border-[var(--linear-border)] bg-[var(--linear-bg-elevated)]">
                {Object.entries(CATEGORY_CONFIG).map(([value, config]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="text-[var(--linear-text-primary)] focus:bg-[var(--linear-bg-tertiary)]"
                  >
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true">{config.icon}</span>
                      {config.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-400" data-testid="category-error">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-[var(--linear-text-secondary)]">
              Priority
            </Label>
            <Select
              onValueChange={(value) => setValue('priority', value as TicketFormData['priority'])}
            >
              <SelectTrigger
                data-testid="priority-select"
                aria-label="Select priority"
                className="border-[var(--linear-border)] bg-[var(--linear-bg-primary)] text-[var(--linear-text-primary)]"
              >
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="border-[var(--linear-border)] bg-[var(--linear-bg-elevated)]">
                {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="text-[var(--linear-text-primary)] focus:bg-[var(--linear-bg-tertiary)]"
                  >
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-sm text-red-400" data-testid="priority-error">
                {errors.priority.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-[var(--linear-text-secondary)]">
            Description
          </Label>
          <Textarea
            id="description"
            data-testid="description-textarea"
            placeholder="Describe your issue in detail..."
            className="min-h-[120px] border-[var(--linear-border)] bg-[var(--linear-bg-primary)] text-[var(--linear-text-primary)] placeholder:text-[var(--linear-text-muted)] focus:border-[var(--linear-accent)] focus:ring-[var(--linear-accent)]"
            {...register('description')}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {errors.description && (
            <p id="description-error" className="text-sm text-red-400" data-testid="description-error">
              {errors.description.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-[var(--linear-accent)] text-white hover:bg-[var(--linear-accent-hover)]"
          disabled={isSubmitting}
          data-testid="submit-button"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
        </Button>
      </form>
    </div>
  );
}
