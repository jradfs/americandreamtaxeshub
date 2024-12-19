import { format, isValid, parseISO, startOfDay, endOfDay, isBefore, isAfter, isSameDay } from 'date-fns';

export const DATE_FORMATS = {
  FULL: 'MMM d, yyyy',
  SHORT: 'MMM d',
  ISO: 'yyyy-MM-dd',
  TIME: 'h:mm a',
  FULL_WITH_TIME: 'MMM d, yyyy h:mm a'
} as const;

export function formatDate(dateString: string | null | undefined, formatStr: string = DATE_FORMATS.FULL): string {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    return format(date, formatStr);
  } catch {
    return '';
  }
}

export function isOverdue(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return false;
    return isBefore(endOfDay(date), new Date());
  } catch {
    return false;
  }
}

export function isDueToday(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return false;
    return isSameDay(date, new Date());
  } catch {
    return false;
  }
}

export function isInDateRange(dateString: string | null | undefined, startDate: Date, endDate: Date): boolean {
  if (!dateString) return false;
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return false;
    return isAfter(date, startOfDay(startDate)) && isBefore(date, endOfDay(endDate));
  } catch {
    return false;
  }
}

export function validateDateString(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return null;
    return date.toISOString();
  } catch {
    return null;
  }
}
