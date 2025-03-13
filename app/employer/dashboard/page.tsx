'use client';

import { Job } from '@/app/types/index';
import { useAuth } from '@/app/components/AuthProvider';
import { JobsKanban } from '@/app/components/employer/JobsKanban';
import { Button, Card, Flex, Grid, Text } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';

interface DashboardProps {
  jobs: Job[];
}

export default function EmployerDashboard({ jobs }: DashboardProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Filter out hidden expired jobs according to design system
  const visibleJobs = jobs.filter(job => !job.isHidden);

  // Calculate job statistics
  const stats = visibleJobs.reduce((acc, job) => {
    const applicants = job.applicants || [];
    
    if (job.status === 'active') {
      acc.activeJobs++;
      acc.totalApplicants += applicants.length;
    }

    // Track applicant statuses
    applicants.forEach(applicant => {
      if (applicant.status === 'shortlisted') {
        acc.shortlistedApplicants++;
      } else if (applicant.status === 'hired') {
        acc.hiredApplicants++;
      }
    });

    return acc;
  }, {
    activeJobs: 0,
    totalApplicants: 0,
    shortlistedApplicants: 0,
    hiredApplicants: 0
  });

  const handleExtendJob = async (jobId: string) => {
    // Implementation for extending job posting
  };

  return (
    <div className="space-y-8">
      <Flex justify="between" align="center">
        <Text size="8" weight="bold">Dashboard</Text>
        <Button 
          size="3" 
          onClick={() => router.push('/employer/jobs/new')}
        >
          Post New Job
        </Button>
      </Flex>

      <Grid columns="4" gap="4">
        <Card>
          <Text size="2" color="gray">Active Jobs</Text>
          <Text size="6" weight="bold">{stats.activeJobs}</Text>
        </Card>
        <Card>
          <Text size="2" color="gray">Total Applicants</Text>
          <Text size="6" weight="bold">{stats.totalApplicants}</Text>
        </Card>
        <Card>
          <Text size="2" color="gray">Shortlisted</Text>
          <Text size="6" weight="bold">{stats.shortlistedApplicants}</Text>
        </Card>
        <Card>
          <Text size="2" color="gray">Hired</Text>
          <Text size="6" weight="bold">{stats.hiredApplicants}</Text>
        </Card>
      </Grid>

      <JobsKanban jobs={visibleJobs} onExtendJob={handleExtendJob} />
    </div>
  );
}
