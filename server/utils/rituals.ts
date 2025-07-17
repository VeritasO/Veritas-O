export const ritualMap = {
  mourning: ['Candle Circle', 'Memory Offering'],
  reconciliation: ['Forgiveness Walk', 'Witness Pairing']
};

export function getRitualsByClass(symbolicClass: string) {
  return ritualMap[symbolicClass] || ['Reflective Silence'];
}