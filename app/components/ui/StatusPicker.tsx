'use client';

import { Select } from '@radix-ui/themes';
import { cn } from '@/lib/utils';

export interface JobStatus {
  value: string;
  label: string;
  color: {
    bg: string;
    text: string;
    dot: string;
  };
}

export const JOB_POSTING_STATUSES: JobStatus[] = [
  {
    value: 'active',
    label: 'Active',
    color: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      dot: 'bg-green-500'
    }
  },
  {
    value: 'expiring-soon',
    label: 'Expiring Soon',
    color: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      dot: 'bg-amber-500'
    }
  },
  {
    value: 'expired',
    label: 'Expired',
    color: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-500'
    }
  },
  {
    value: 'draft',
    label: 'Draft',
    color: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      dot: 'bg-gray-500'
    }
  }
];

interface StatusPickerProps {
  value: string;
  onChange: (value: string) => void;
  statuses?: JobStatus[];
  className?: string;
}

export function StatusPicker({ 
  value, 
  onChange, 
  statuses = JOB_POSTING_STATUSES,
  className 
}: StatusPickerProps) {
  const selectedStatus = statuses.find(status => status.value === value);

  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger 
        className={cn(
          'min-w-[140px]',
          selectedStatus?.color.bg,
          selectedStatus?.color.text,
          className
        )}
      >
        <div className="flex items-center gap-2">
          <div 
            className={cn(
              'w-2 h-2 rounded-full',
              selectedStatus?.color.dot
            )} 
          />
          {selectedStatus?.label || 'Select Status'}
        </div>
      </Select.Trigger>
      <Select.Content>
        {statuses.map(status => (
          <Select.Item 
            key={status.value} 
            value={status.value}
            className={cn(
              'flex items-center gap-2',
              status.color.bg,
              status.color.text
            )}
          >
            <div 
              className={cn(
                'w-2 h-2 rounded-full',
                status.color.dot
              )} 
            />
            {status.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
