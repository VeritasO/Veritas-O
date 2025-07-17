export function formatCVT(dateString: string | Date): string {
  const d = new Date(dateString);
  return d.toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' CVT';
}