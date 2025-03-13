'use client';

import { useState } from 'react';
import { Card, Grid, Text } from '@radix-ui/themes';
import { Job } from '@/app/types/index';
import { getJobStatus, canExtendJob } from '@/lib/jobUtils';
import { Badge } from '@/app/components/ui/Badge';
import { Button, Flex } from '@radix-ui/themes';

interface JobsKanbanProps {
  jobs: Job[];
  onExtendJob?: (jobId: string) => void;
}

export function JobsKanban({ jobs, onExtendJob }: JobsKanbanProps) {
  // Group jobs by status and filter out hidden expired jobs
  const visibleJobs = jobs.filter(job => !job.isHidden);
  
  const draftJobs = visibleJobs.filter(job => job.status === 'draft');
  const activeJobs = visibleJobs.filter(job => job.status === 'active');
  const expiredJobs = visibleJobs.filter(job => job.status === 'expired');

  const renderJobCard = (job: Job) => {
    const status = getJobStatus(job);
    const statusColors = {
      'active': 'bg-green-50 text-green-700',
      'expiring-soon': 'bg-amber-50 text-amber-700',
      'expired': 'bg-red-50 text-red-700',
      'draft': 'bg-gray-50 text-gray-700'
    };

    const applicants = job.applicants || [];
    const pendingCount = applicants.filter(a => a.status === 'pending').length;
    const shortlistedCount = applicants.filter(a => a.status === 'shortlisted').length;
    const hiredCount = applicants.filter(a => a.status === 'hired').length;

    return (
      <Card key={job.id} className="p-4 mb-4 transition-all duration-150 hover:shadow-md">
        <Flex direction="column" gap="2">
          <Flex justify="between" align="start">
            <div>
              <Text size="5" weight="medium">{job.title}</Text>
              <Text size="2" color="gray">{job.company.name}</Text>
            </div>
            <Badge className={statusColors[status]}>
              {status === 'active' && 'Active'}
              {status === 'expiring-soon' && 'Expiring Soon'}
              {status === 'expired' && 'Expired'}
              {status === 'draft' && 'Draft'}
            </Badge>
          </Flex>

          <Flex gap="4">
            <Text size="2">{job.location}</Text>
            <Text size="2">{job.type}</Text>
          </Flex>

          <div>
            <Text size="2" weight="medium" className="mb-1">Applications</Text>
            <div className="flex gap-2">
              <Badge variant="outline">
                {pendingCount} Pending
              </Badge>
              <Badge variant="outline">
                {shortlistedCount} Shortlisted
              </Badge>
              <Badge variant="outline">
                {hiredCount} Hired
              </Badge>
            </div>
          </div>

          {onExtendJob && status !== 'draft' && canExtendJob(job.extensionsUsed) && (
            <Button 
              size="2" 
              variant="outline" 
              onClick={() => onExtendJob(job.id)}
              className="self-end mt-2"
            >
              {status === 'expired' ? 'Repost' : 'Extend'}
            </Button>
          )}
        </Flex>
      </Card>
    );
  };

  return (
    <Grid columns="3" gap="4">
      <div>
        <Text size="4" weight="medium" className="mb-4">Draft ({draftJobs.length})</Text>
        <div className="space-y-4">
          {draftJobs.map(renderJobCard)}
          {draftJobs.length === 0 && (
            <Text size="2" color="gray" align="center">No draft jobs</Text>
          )}
        </div>
      </div>

      <div>
        <Text size="4" weight="medium" className="mb-4">Active ({activeJobs.length})</Text>
        <div className="space-y-4">
          {activeJobs.map(renderJobCard)}
          {activeJobs.length === 0 && (
            <Text size="2" color="gray" align="center">No active jobs</Text>
          )}
        </div>
      </div>

      <div>
        <Text size="4" weight="medium" className="mb-4">Expired ({expiredJobs.length})</Text>
        <div className="space-y-4">
          {expiredJobs.map(renderJobCard)}
          {expiredJobs.length === 0 && (
            <Text size="2" color="gray" align="center">No expired jobs</Text>
          )}
        </div>
      </div>
    </Grid>
  );
}
