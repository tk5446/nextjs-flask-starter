export type UserType = 'employer' | 'job_seeker';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  profileCompleted: boolean;
  organizationName?: string;
  companyData?: {
    logo?: string;
    industry?: string;
    size?: string;
    description?: string;
    website?: string;
    locations?: string[];
  };
  jobSeekerData?: {
    resume?: string;
    skills?: string[];
    preferredJobTypes?: string[];
    preferredLocations?: string[];
    experienceLevel?: string;
    desiredSalaryRange?: {
      min: number;
      max: number;
      currency: string;
    };
  };
}

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export interface JobApplicant {
  id: string;
  name: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: JobType;
  remotePreference?: 'remote' | 'hybrid' | 'onsite';
  experienceLevel?: 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Lead' | 'Executive';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: string[];
  responsibilities: string[];
  company: {
    name: string;
    logo?: string;
  };
  postedAt: string;
  expiresAt: string;
  extensionsUsed: number;
  status: 'draft' | 'active' | 'expired';
  isHidden: boolean;
  applicants?: JobApplicant[];
}
