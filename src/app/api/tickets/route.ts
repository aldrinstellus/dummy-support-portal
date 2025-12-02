import { NextRequest, NextResponse } from 'next/server';
import { getMockTickets, mockTickets } from '@/lib/mock-data';
import { ticketSchema } from '@/lib/validations/ticket';
import { generateId } from '@/lib/utils';
import { Ticket } from '@/types/ticket';

// In-memory storage for demo (starts with mock data)
let tickets: Ticket[] = [...mockTickets];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') || undefined;
  const priority = searchParams.get('priority') || undefined;
  const category = searchParams.get('category') || undefined;

  let filtered = [...tickets];

  if (status) {
    filtered = filtered.filter((t) => t.status === status);
  }
  if (priority) {
    filtered = filtered.filter((t) => t.priority === priority);
  }
  if (category) {
    filtered = filtered.filter((t) => t.category === category);
  }

  // Sort by created date, newest first
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({
    success: true,
    data: filtered,
    pagination: {
      total: filtered.length,
      limit: 50,
      offset: 0,
      hasMore: false,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const result = ticketSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, category, priority, description } = result.data;

    // Simulate AI triage
    const aiTriage = simulateAITriage(description, category);

    // Create new ticket
    const newTicket: Ticket = {
      id: generateId(),
      name,
      email,
      category,
      priority,
      description,
      status: 'open',
      aiCategory: aiTriage.category,
      aiConfidence: aiTriage.confidence,
      aiSuggestedPriority: aiTriage.suggestedPriority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to in-memory storage
    tickets.unshift(newTicket);

    // INTEGRATION: If urgent or contains critical keywords, create incident on Status Page
    const isUrgent = priority === 'urgent' || aiTriage.suggestedPriority === 'urgent';
    const hasCriticalKeywords = /down|outage|critical|broken|not working|emergency/i.test(description);

    if (isUrgent || hasCriticalKeywords) {
      const statusPageUrl = process.env.STATUS_PAGE_URL || 'http://localhost:3023';
      try {
        await fetch(`${statusPageUrl}/api/incidents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Customer Report: ${description.slice(0, 50)}${description.length > 50 ? '...' : ''}`,
            serviceId: mapCategoryToService(category),
            severity: priority === 'urgent' || aiTriage.suggestedPriority === 'urgent' ? 'critical' : 'major',
          }),
        });
        console.log('[Integration] Created incident on Status Page for urgent ticket');
      } catch (error) {
        // Fail silently - don't block ticket creation if Status Page is down
        console.log('[Integration] Status Page unavailable, skipping incident creation');
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: newTicket,
        message: 'Ticket created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Map ticket category to Status Page service ID
function mapCategoryToService(category: string): string {
  const mapping: Record<string, string> = {
    technical: 'api',
    billing: 'web',
    general: 'web',
    'feature-request': 'web',
  };
  return mapping[category] || 'api';
}

// Simple AI triage simulation
function simulateAITriage(
  description: string,
  userCategory: string
): {
  category: string;
  confidence: number;
  suggestedPriority: 'low' | 'medium' | 'high' | 'urgent';
} {
  const lowerDesc = description.toLowerCase();

  // Keyword-based categorization
  let category = userCategory;
  let confidence = 0.85;

  if (lowerDesc.includes('payment') || lowerDesc.includes('charge') || lowerDesc.includes('invoice') || lowerDesc.includes('billing')) {
    category = 'billing';
    confidence = 0.92;
  } else if (lowerDesc.includes('bug') || lowerDesc.includes('error') || lowerDesc.includes('crash') || lowerDesc.includes('not working')) {
    category = 'technical';
    confidence = 0.88;
  } else if (lowerDesc.includes('feature') || lowerDesc.includes('would like') || lowerDesc.includes('suggestion')) {
    category = 'feature-request';
    confidence = 0.86;
  }

  // Priority detection
  let suggestedPriority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';

  if (lowerDesc.includes('urgent') || lowerDesc.includes('critical') || lowerDesc.includes('down') || lowerDesc.includes('immediately')) {
    suggestedPriority = 'urgent';
    confidence = Math.min(confidence + 0.05, 0.98);
  } else if (lowerDesc.includes('asap') || lowerDesc.includes('important') || lowerDesc.includes('blocking')) {
    suggestedPriority = 'high';
  } else if (lowerDesc.includes('when possible') || lowerDesc.includes('nice to have')) {
    suggestedPriority = 'low';
  }

  return {
    category,
    confidence: Math.round(confidence * 100) / 100,
    suggestedPriority,
  };
}
