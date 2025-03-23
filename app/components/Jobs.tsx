'use client';

import { Job } from '@/app/types/index';
import { JobCard } from '@/app/components/jobs/JobCard';
import { JobFilters } from '@/app/components/jobs/JobFilters';
import { Grid } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { shouldHideExpiredJob } from '@/lib/jobUtils';

interface JobsProps {
  jobs: Job[];
  searchQuery: string;
}

export function Jobs({ jobs, searchQuery }: JobsProps) {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);

  useEffect(() => {
    const filtered = jobs.filter(job => {
      // Hide expired jobs after 30 days
      if (shouldHideExpiredJob(job.expiresAt)) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          job.title.toLowerCase().includes(query) ||
          job.company.name.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
        );
      }

      return true;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchQuery]);

  return (
    <div className="space-y-6">
      <JobFilters 
        onFiltersChange={(filters) => {
          const filtered = jobs.filter(job => {
            if (filters.remoteOnly && job.remotePreference !== 'remote') return false;
            if (filters.jobTypes.length && !filters.jobTypes.includes(job.type)) return false;
            if (filters.experienceLevels.length && !filters.experienceLevels.includes(job.experienceLevel)) return false;
            if (filters.locations.length && !filters.locations.includes(job.location)) return false;
            if (job.salary && (job.salary.min < filters.salaryRange.min || job.salary.max > filters.salaryRange.max)) return false;
            return true;
          });
          setFilteredJobs(filtered);
        }}
      />
      <Grid columns="3" gap="4">
        {filteredJobs.map(job => {
          return (
            <JobCard 
              key={job.id}
              id={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              type={job.type}
              salary={job.salary}
              postedAt={new Date(job.postedAt).toISOString()}
              expiresAt={new Date(job.expiresAt).toISOString()}
              extensionsUsed={job.extensionsUsed}
            />
          );
        })}
      </Grid>
    </div>
  );
}