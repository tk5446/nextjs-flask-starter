'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
  status?: 'active' | 'expired' | 'draft';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'solid',
  status,
  className 
}: BadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700';
      case 'expired':
        return 'bg-red-50 text-red-700';
      case 'draft':
        return 'bg-gray-50 text-gray-700';
      default:
        return variant === 'solid' 
          ? 'bg-[#f8fafc] text-[#2563eb]' 
          : 'border border-[#2563eb] text-[#2563eb]';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-150 ease-in-out',
        getStatusStyles(),
        className
      )}
    >
      {children}
    </span>
  );
}
