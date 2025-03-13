'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'solid',
  className 
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'solid' ? 'bg-gray-100 text-gray-800' : 'border border-gray-200',
        className
      )}
    >
      {children}
    </span>
  );
}
