import { Card } from '@/app/components/ui/Card';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  id: string;
  title: string;
  company: {
    name: string;
    logo?: string;
  };
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: string;
  postedAt: Date;
  expiresAt: Date;
  extensionsUsed: number;
  className?: string;
  onClick?: () => void;
}

export function JobCard({
  title,
  company,
  location,
  salary,
  type,
  postedAt,
  expiresAt,
  extensionsUsed,
  className,
  onClick,
}: JobCardProps) {
  const daysUntilExpiry = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const canExtend = extensionsUsed < 6;

  return (
    <Card 
      className={cn('group', className)}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {company.logo ? (
          <img 
            src={company.logo} 
            alt={company.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-500">
              {company.name.charAt(0)}
            </span>
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold text-gray-900 group-hover:text-primary transition-colors duration-150">
            {title}
          </h3>
          <p className="text-[14px] font-medium text-gray-500 mt-1">
            {company.name}
          </p>
          
          <div className="flex items-center gap-3 mt-3 text-sm">
            <span className="text-gray-600">{location}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600">{type}</span>
            {salary && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: salary.currency,
                    maximumFractionDigits: 0,
                  }).format(salary.min)} - {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: salary.currency,
                    maximumFractionDigits: 0,
                  }).format(salary.max)}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-sm text-gray-500">
            Posted {formatDistanceToNow(postedAt)} ago
          </span>
          {daysUntilExpiry <= 7 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-amber-600">
                Expires in {daysUntilExpiry} days
              </span>
              {canExtend && (
                <button 
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle extension
                  }}
                >
                  Extend
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
