export function getCVT(): string {
  // For now, return ISO string in UTC as CVT
  return new Date().toISOString();
}