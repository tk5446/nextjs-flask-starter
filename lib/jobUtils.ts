import { Job } from '@/app/types/index';
import { differenceInDays, parseISO } from 'date-fns';

// Maximum number of extensions allowed per job
const MAX_EXTENSIONS = 6;

// Number of days before expiry to show warning
const EXPIRY_WARNING_DAYS = 7;

// Number of days after expiry to hide job
const HIDE_AFTER_DAYS = 30;

// Number of days to extend a job posting
const EXTENSION_DAYS = 30;

/**
 * Get the current status of a job based on its expiry date and other factors
 */
export function getJobStatus(job: Job): 'active' | 'expiring-soon' | 'expired' | 'draft' {
  if (job.status === 'draft') return 'draft';
  
  const now = new Date();
  const expiryDate = parseISO(job.expiresAt);
  
  if (now > expiryDate) {
    return 'expired';
  }
  
  const daysToExpiry = differenceInDays(expiryDate, now);
  if (daysToExpiry <= EXPIRY_WARNING_DAYS) {
    return 'expiring-soon';
  }
  
  return 'active';
}

/**
 * Check if a job posting can be extended based on number of extensions used
 */
export function canExtendJob(extensionsUsed: number): boolean {
  return extensionsUsed < MAX_EXTENSIONS;
}

/**
 * Calculate new expiry date when extending a job
 */
export function calculateNewExpiryDate(currentExpiryDate: string): string {
  const expiryDate = parseISO(currentExpiryDate);
  const newExpiryDate = new Date(expiryDate);
  newExpiryDate.setDate(newExpiryDate.getDate() + EXTENSION_DAYS);
  return newExpiryDate.toISOString();
}

/**
 * Check if an expired job should be hidden from search results
 */
export function shouldHideExpiredJob(expiryDate: string): boolean {
  // const now = new Date();
  // const expiry = parseISO(expiryDate);
  // const diffDays = differenceInDays(now, expiry);
  // return diffDays > HIDE_AFTER_DAYS;
  return false;
}

/**
 * Get the total possible duration for a job posting in days
 */
export function getTotalPossibleDuration(): number {
  return EXTENSION_DAYS * (MAX_EXTENSIONS + 1); // Initial 30 days + 6 extensions
}

/**
 * Get a human-readable string for the job posting duration
 */
export function getJobDurationText(job: Job): string {
  const expiryDate = parseISO(job.expiresAt);
  const now = new Date();
  const diffDays = differenceInDays(expiryDate, now);
  
  if (diffDays < 0) {
    return 'Expired';
  }
  
  if (diffDays === 0) {
    return 'Expires today';
  }
  
  if (diffDays === 1) {
    return 'Expires tomorrow';
  }
  
  return `Expires in ${diffDays} days`;
}
