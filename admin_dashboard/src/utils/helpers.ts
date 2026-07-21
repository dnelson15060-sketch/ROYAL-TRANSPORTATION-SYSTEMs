/**
 * Formats an ISO date string into a human readable date (e.g. "Jul 21, 2026").
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats an ISO date string into a human readable date + time.
 */
export function formatDateTime(dateString?: string): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type StatusColorMap = Record<string, string>;

const STATUS_COLORS: StatusColorMap = {
  active: 'green',
  in_progress: 'blue',
  on_route: 'yellow',
  completed: 'gray',
  inactive: 'red',
};

/**
 * Maps an entity status to a badge color used by the Badge component.
 */
export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? 'gray';
}

/**
 * Converts a snake_case status into a Title Case label (e.g. "on_route" -> "On Route").
 */
export function formatStatusLabel(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Returns the initials for a display name (e.g. "John Doe" -> "JD").
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Simple case-insensitive substring search helper used across list pages.
 */
export function matchesSearch(value: string, query: string): boolean {
  return value.toLowerCase().includes(query.trim().toLowerCase());
}
