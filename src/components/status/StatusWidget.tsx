'use client';

import { useState, useEffect } from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';

interface StatusData {
  overall: 'operational' | 'degraded' | 'outage';
  services: Array<{
    name: string;
    status: string;
  }>;
}

interface StatusWidgetProps {
  collapsed?: boolean;
}

const statusConfig = {
  operational: {
    label: 'All Systems Operational',
    shortLabel: 'Operational',
    color: 'text-green-700 dark:text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-500/10',
    borderColor: 'border-green-300 dark:border-green-500/20',
    icon: CheckCircle2,
  },
  degraded: {
    label: 'Degraded Performance',
    shortLabel: 'Degraded',
    color: 'text-amber-700 dark:text-yellow-500',
    bgColor: 'bg-amber-100 dark:bg-yellow-500/10',
    borderColor: 'border-amber-300 dark:border-yellow-500/20',
    icon: AlertTriangle,
  },
  outage: {
    label: 'Service Outage',
    shortLabel: 'Outage',
    color: 'text-red-700 dark:text-red-500',
    bgColor: 'bg-red-100 dark:bg-red-500/10',
    borderColor: 'border-red-300 dark:border-red-500/20',
    icon: XCircle,
  },
  unavailable: {
    label: 'Status Unavailable',
    shortLabel: 'Unavailable',
    color: 'text-gray-600 dark:text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-500/10',
    borderColor: 'border-gray-300 dark:border-gray-500/20',
    icon: Activity,
  },
};

export function StatusWidget({ collapsed = false }: StatusWidgetProps) {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const statusPageUrl = process.env.NEXT_PUBLIC_STATUS_PAGE_URL || 'http://localhost:3023';

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${statusPageUrl}/api/status`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch status');
        const data = await res.json();
        setStatus(data.data);
        setError(false);
      } catch {
        setError(true);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [statusPageUrl]);

  const config = error
    ? statusConfig.unavailable
    : statusConfig[status?.overall || 'operational'];

  const Icon = config.icon;

  const handleClick = () => {
    window.open(statusPageUrl, '_blank', 'noopener,noreferrer');
  };

  if (collapsed) {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all hover:scale-105 ${config.bgColor} ${config.borderColor} border`}
        title={loading ? 'Loading...' : config.label}
        aria-label={`System status: ${loading ? 'Loading' : config.label}`}
      >
        <Icon className={`w-5 h-5 ${config.color}`} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-[1.02] ${config.bgColor} ${config.borderColor} border group`}
      aria-label={`System status: ${loading ? 'Loading' : config.label}. Click to view status page.`}
    >
      <div className={`flex-shrink-0 p-2 rounded-md ${config.bgColor}`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className={`text-sm font-medium truncate ${config.color}`}>
          {loading ? 'Checking status...' : config.shortLabel}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {loading ? '' : error ? 'Could not reach status page' : `${status?.services.length || 0} services`}
        </p>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </button>
  );
}
