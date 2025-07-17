export function detectContradiction(content: string): boolean {
  const contradictionPatterns = [
    /\bbut\b/i, /\bhowever\b/i, /\bcontradicts\b/i, /\bconflict\b/i, /\bparadox\b/i,
  ];
  return contradictionPatterns.some(pattern => pattern.test(content));
}