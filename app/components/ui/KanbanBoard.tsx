import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Card } from './Card';

interface KanbanColumnProps {
  title: string;
  children: ReactNode;
  className?: string;
  count?: number;
}

interface KanbanCardProps {
  title: string;
  company: string;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function KanbanColumn({ title, children, className, count }: KanbanColumnProps) {
  return (
    <div className={cn('flex flex-col min-w-[320px]', className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        {count !== undefined && (
          <span className="text-sm text-gray-500">{count}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}

export function KanbanCard({ title, company, children, className, onClick }: KanbanCardProps) {
  return (
    <Card 
      className={cn('group', className)} 
      onClick={onClick}
    >
      <div className="flex flex-col gap-1">
        <h4 className="text-[18px] font-semibold text-gray-900 group-hover:text-primary transition-colors duration-150">
          {title}
        </h4>
        <p className="text-[14px] font-medium text-gray-500">
          {company}
        </p>
        {children}
      </div>
    </Card>
  );
}
