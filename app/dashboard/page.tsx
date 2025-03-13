'use client';

import { JobGrid } from '@/app/components/jobs/JobGrid';
import { JobFilters } from '@/app/components/jobs/JobFilters';
import { Card } from '@/app/components/ui/Card';
import { Button, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import { 
  BookmarkIcon, 
  BriefcaseIcon, 
  DocumentTextIcon,
  BellIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

// Mock data for example
const mockJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: {
      name: 'Acme Corp',
      logo: '/companies/acme.png'
    },
    location: 'San Francisco, CA',
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    },
    type: 'Full-time',
    postedAt: new Date('2025-02-15'),
    expiresAt: new Date('2025-04-15'),
    extensionsUsed: 0
  },
  {
    id: '2',
    title: 'Product Designer',
    company: {
      name: 'TechCo',
      logo: '/companies/techco.png'
    },
    location: 'Remote',
    salary: {
      min: 90000,
      max: 140000,
      currency: 'USD'
    },
    type: 'Full-time',
    postedAt: new Date('2025-02-20'),
    expiresAt: new Date('2025-03-19'),
    extensionsUsed: 0
  }
];

export default function JobSeekerDashboard() {
  const router = useRouter();

  const stats = {
    savedJobs: 12,
    applications: 8,
    profileViews: 45
  };

  const recommendedSkills = [
    'React',
    'TypeScript',
    'Node.js',
    'UI/UX Design',
    'Project Management'
  ];

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <div className="w-64 flex-shrink-0">
        <JobFilters
          onFiltersChange={(filters) => {
            console.log('Filters changed:', filters);
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Heading size="6">Dashboard</Heading>
            <Text size="2" color="gray">Find and track your job opportunities</Text>
          </div>
          <Button 
            variant="soft"
            onClick={() => router.push('/profile')}
          >
            <DocumentTextIcon className="w-4 h-4" />
            Update Profile
          </Button>
        </div>

        {/* Stats */}
        <Grid columns="3" gap="4">
          <Card className="p-4">
            <Flex direction="column" gap="1">
              <Text size="1" color="gray">Saved Jobs</Text>
              <Flex align="center" gap="2">
                <BookmarkIcon className="w-5 h-5 text-primary" />
                <Text size="6" weight="bold">{stats.savedJobs}</Text>
              </Flex>
            </Flex>
          </Card>

          <Card className="p-4">
            <Flex direction="column" gap="1">
              <Text size="1" color="gray">Applications</Text>
              <Flex align="center" gap="2">
                <BriefcaseIcon className="w-5 h-5 text-primary" />
                <Text size="6" weight="bold">{stats.applications}</Text>
              </Flex>
            </Flex>
          </Card>

          <Card className="p-4">
            <Flex direction="column" gap="1">
              <Text size="1" color="gray">Profile Views</Text>
              <Flex align="center" gap="2">
                <DocumentTextIcon className="w-5 h-5 text-primary" />
                <Text size="6" weight="bold">{stats.profileViews}</Text>
              </Flex>
            </Flex>
          </Card>
        </Grid>

        {/* Job Alert */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <Flex justify="between" align="center">
            <Flex gap="3" align="center">
              <BellIcon className="w-5 h-5 text-primary" />
              <div>
                <Text weight="medium">Job Alert Active</Text>
                <Text size="1" color="gray">
                  You'll receive daily notifications for Software Engineering roles in San Francisco
                </Text>
              </div>
            </Flex>
            <Button variant="ghost" size="1">
              <XMarkIcon className="w-4 h-4" />
            </Button>
          </Flex>
        </Card>

        {/* Recommended Skills */}
        <Card className="p-6">
          <Text size="3" weight="medium" className="mb-4">Recommended Skills</Text>
          <Flex gap="2" wrap="wrap">
            {recommendedSkills.map(skill => (
              <Button key={skill} variant="soft" size="1">
                {skill}
              </Button>
            ))}
          </Flex>
        </Card>

        {/* Job Listings */}
        <div>
          <Flex justify="between" align="center" className="mb-4">
            <Text size="4" weight="medium">Recommended Jobs</Text>
            <Button variant="outline" onClick={() => router.push('/jobs')}>
              View All
            </Button>
          </Flex>
          <JobGrid jobs={mockJobs} />
        </div>
      </div>
    </div>
  );
}
