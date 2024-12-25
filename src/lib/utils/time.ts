export function hoursToMinutes(hours: number): number {
  return Math.round(hours * 60);
}

export function minutesToHours(minutes: number): number {
  return Math.round(minutes / 60 * 100) / 100;
}

export function roundToNearest(value: number, nearest: number = 1): number {
  return Math.round(value / nearest) * nearest;
}