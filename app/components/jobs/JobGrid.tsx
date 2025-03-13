import { Card } from '@/app/components/ui/Card';
import { JobCard } from './JobCard';
import { useEffect, useState } from 'react';

interface Job {
  id: string;
  title: string;
  company: {
    name: string;
    logo?: string;
  };
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: string;
  postedAt: Date;
  expiresAt: Date;
  extensionsUsed: number;
}

interface JobGridProps {
  jobs: Job[];
  loading?: boolean;
}

export function JobGrid({ jobs, loading }: JobGridProps) {
  // Filter out expired jobs that are more than 30 days old
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  
  useEffect(() => {
    const now = new Date();
    setFilteredJobs(jobs.filter(job => {
      const expiryDate = new Date(job.expiresAt);
      return expiryDate > now;
    }));
  }, [jobs]);

  if (loading) {
    return (
      <div className="grid grid-cols-job-grid gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-[140px] animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredJobs.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900">No jobs found</h3>
        <p className="text-gray-500 mt-2">
          Try adjusting your search filters or check back later for new opportunities.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-job-grid gap-4">
      {filteredJobs.map((job) => (
        <JobCard
          key={job.id}
          {...job}
          onClick={() => {
            // Handle job click
          }}
        />
      ))}
    </div>
  );
}
