import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { addDays, isAfter, isBefore, differenceInDays, parseISO } from 'date-fns';
import { Job } from '@/app/types/index';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MAX_EXTENSIONS = 6;
const EXTENSION_DAYS = 30;
const EXPIRY_WARNING_DAYS = 7;

/**
 * Checks if a job posting can be extended based on the number of extensions used
 */
export function canExtendJob(extensionsUsed: number): boolean {
  return extensionsUsed < MAX_EXTENSIONS;
}

/**
 * Gets the number of days until a job posting expires
 * Returns a negative number if the job has already expired
 */
export function getDaysUntilExpiry(expiryDate: Date): number {
  return differenceInDays(expiryDate, new Date());
}

/**
 * Checks if a job posting should be hidden from search results
 * Jobs are hidden if they have expired and cannot be extended further
 */
export function shouldHideJob(job: Job): boolean {
  const expiryDate = parseISO(job.expiresAt);
  const isExpired = isAfter(new Date(), expiryDate);
  return isExpired && !canExtendJob(job.extensionsUsed);
}

/**
 * Checks if a job posting is expiring soon (within 7 days)
 */
export function isExpiringSoon(expiryDate: Date): boolean {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  return daysUntilExpiry > 0 && daysUntilExpiry <= EXPIRY_WARNING_DAYS;
}

/**
 * Gets the new expiry date for a job posting after extending it
 */
export function getExtendedExpiryDate(currentExpiryDate: Date): Date {
  return addDays(currentExpiryDate, EXTENSION_DAYS);
}

/**
 * Gets the total possible duration for a job posting in days
 * This includes the initial 30-day period plus 6 possible extensions
 */
export function getMaxJobDuration(): number {
  return EXTENSION_DAYS * (MAX_EXTENSIONS + 1);
}

/**
 * Gets the job posting status based on its expiry date and extensions used
 */
export function getJobStatus(job: Job): 'active' | 'expiring-soon' | 'expired' {
  const expiryDate = parseISO(job.expiresAt);
  if (isAfter(new Date(), expiryDate)) {
    return 'expired';
  }
  
  if (isExpiringSoon(expiryDate)) {
    return 'expiring-soon';
  }
  
  return 'active';
}

/**
 * Gets a human-readable string for the job posting duration
 */
export function getJobDurationText(job: Job): string {
  const expiryDate = parseISO(job.expiresAt);
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  const extensionsRemaining = MAX_EXTENSIONS - job.extensionsUsed;

  if (daysUntilExpiry < 0) {
    return `Expired ${Math.abs(daysUntilExpiry)} days ago`;
  }

  let text = `${daysUntilExpiry} days remaining`;
  if (extensionsRemaining > 0) {
    text += ` (${extensionsRemaining} extension${extensionsRemaining === 1 ? '' : 's'} available)`;
  }

  return text;
}

/**
 * Format currency with proper locale and currency symbol
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}
