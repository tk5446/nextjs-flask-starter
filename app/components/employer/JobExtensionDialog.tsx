'use client';

import { useState } from 'react';
import { Dialog, Button, Text, Flex } from '@radix-ui/themes';
import { Job } from '@/app/types/index';
import { format, parseISO } from 'date-fns';
import { canExtendJob, calculateNewExpiryDate } from '@/lib/jobUtils';

interface JobExtensionDialogProps {
  job: Job;
  onExtend: (job: Job) => void;
}

export function JobExtensionDialog({ job, onExtend }: JobExtensionDialogProps) {
  const [open, setOpen] = useState(false);
  const canExtend = canExtendJob(job.extensionsUsed);
  const newExpiryDate = calculateNewExpiryDate(job.expiresAt);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button 
          disabled={!canExtend}
          variant="soft"
          color="blue"
          className="w-full transition-all duration-150 ease-in-out"
        >
          Extend Posting
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Extend Job Posting</Dialog.Title>
        <Dialog.Description>
          Extend this job posting for an additional 30 days. This action cannot be undone.
        </Dialog.Description>

        <Flex direction="column" gap="3" mt="4">
          <Text>Current expiry: {format(parseISO(job.expiresAt), 'PPP')}</Text>
          <Text>New expiry: {format(parseISO(newExpiryDate), 'PPP')}</Text>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button 
            onClick={() => {
              onExtend({ ...job, expiresAt: newExpiryDate, extensionsUsed: job.extensionsUsed + 1 });
              setOpen(false);
            }}
          >
            Extend Posting
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
