'use client';

import { useState, useEffect } from 'react';
import { Job } from '@/app/types/index';
import { Jobs } from '@/app/components/Jobs';
import { SearchBar } from '@/app/components/SearchBar';
import { Text, Button, TextField } from '@radix-ui/themes';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { parseISO } from 'date-fns';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        // Convert Date to string if necessary
        const jobData: Job[] = data.jobs.map((job: any) => ({
          ...job,
          postedAt: parseISO(job.postedAt),
          expiresAt: parseISO(job.expiresAt),
        }));

        const jobs: Job[] = jobData.map(job => ({
          ...job,
          postedAt: new Date(job.postedAt).toISOString(),
          expiresAt: new Date(job.expiresAt).toISOString(),
        }));

        setJobs(jobs);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero section with job alerts signup */}
      <div className="bg-[#2563eb] text-white p-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <Text size="9" weight="bold">Find Your Next Job in Marin County</Text>
          <Text size="4">Get new jobs matching your criteria delivered to your inbox</Text>
          <div className="flex gap-3 mt-6">
            <TextField.Root className="bg-white rounded-md flex-1">
              <TextField.Input 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </TextField.Root>
            <Button size="3">
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              Get Job Alerts
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="space-y-4">
          <Text size="8" weight="bold">Latest Jobs</Text>
          <SearchBar onSearch={setSearchQuery} />
        </div>
        {error ? (
          <div className="text-center py-12">
            <Text color="red" size="3">{error}</Text>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <Text size="3">Loading jobs...</Text>
          </div>
        ) : (
          <Jobs jobs={jobs} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
}
