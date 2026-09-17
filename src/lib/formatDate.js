// lib/formatDate.js

/**
 * Formats a Date (or ISO string) as "10 Jun 2026", matching the design.
 */
export function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!d || Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Formats a Date as "10:24 AM" for email timestamps. */
export function formatTime(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!d || Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
