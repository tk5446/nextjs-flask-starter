'use client';

import { useState } from 'react';
import { Job } from '@/app/types/index';
import { Jobs } from '@/app/components/Jobs';
import { SearchBar } from '@/app/components/SearchBar';
import { Text } from '@radix-ui/themes';

// Mock data for testing
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: {
      name: 'Acme Corp',
      logo: '/logos/acme.png'
    },
    description: 'Join our team as a Senior Frontend Engineer...',
    status: 'active',
    type: 'Full-time',
    location: 'San Francisco, CA',
    remotePreference: 'hybrid',
    experienceLevel: 'Senior Level',
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    },
    postedAt: '2024-01-15T00:00:00Z',
    expiresAt: '2024-02-15T00:00:00Z',
    extensionsUsed: 0,
    isHidden: false,
    applicants: []
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 p-6 bg-[#f8fafc]">
      <Text size="8" weight="bold" className="text-[18px] font-semibold">Job Board</Text>
      <SearchBar onSearch={setSearchQuery} />
      <Jobs jobs={mockJobs} searchQuery={searchQuery} />
    </div>
  );
}
