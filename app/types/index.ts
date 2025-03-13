// User Types
export type UserType = 'employer' | 'job_seeker';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  profileCompleted: boolean;
  profileImage?: string;
  organizationId?: string;
  organizationName?: string;
  companyData?: {
    logo?: string;
    industry?: string;
    size?: string;
    description?: string;
    website?: string;
    locations?: string[];
  };
}

// Job Types
export type JobStatus = 'draft' | 'active' | 'expired';
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
export type RemotePreference = 'remote' | 'hybrid' | 'on-site';
export type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Lead' | 'Executive';
export type ApplicantStatus = 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';

export interface Company {
  name: string;
  logo?: string;
}

export interface JobApplicant {
  id: string;
  status: ApplicantStatus;
  appliedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: Company;
  description: string;
  status: JobStatus;
  type: JobType;
  location: string;
  remotePreference: RemotePreference;
  experienceLevel: ExperienceLevel;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  postedAt: string;
  expiresAt: string;
  extensionsUsed: number;
  isHidden: boolean;
  applicants?: JobApplicant[];
}
