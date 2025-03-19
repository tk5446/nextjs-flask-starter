import { Card } from '@/app/components/ui/Card';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Text, Badge } from '@radix-ui/themes';

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
  postedAt: string; // Expecting a string in ISO format or similar
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

  // Ensure the postedAt string is parsed into a valid Date object
  const parsedDate = new Date(postedAt);

  // Check if the parsed date is valid
  const isValidDate = !isNaN(parsedDate.getTime());

  // Ensure salary.min and salary.max are valid numbers
  const formattedSalary = salary && !isNaN(salary.min) && !isNaN(salary.max)
    ? `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`
    : 'Salary not provided';

  return (
    <Card 
      className={cn('group p-4 hover:border-[#2563eb] transition-all duration-150', className)}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {company && company.logo ? (
          <img 
            src={company.logo} 
            alt={company.name}
            className="w-12 h-12 rounded-lg object-cover bg-gray-100"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <Text size="5" weight="bold" className="text-gray-400">
              {company?.name[0]}
            </Text>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Text size="5" weight="bold" className="text-[18px] font-semibold block">
                {title}
              </Text>
              <Text size="2" className="text-[14px] text-gray-500 mt-1">
                {company?.name}
              </Text>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge color={daysUntilExpiry <= 7 ? "red" : "blue"} radius="full">
                {type}
              </Badge>
              {salary && (
                <Text size="2" className="text-gray-500">
                  {formattedSalary}
                </Text>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <Text size="2">{location}</Text>
            <Text size="2">•</Text>
            {isValidDate ? (
              <Text size="2">Posted {formatDistanceToNow(parsedDate)} ago</Text>
            ) : (
              <Text size="2" className="text-red-500">Invalid posted date</Text>
            )}
            {daysUntilExpiry <= 7 && (
              <>
                <Text size="2">•</Text>
                <Text size="2" className="text-red-500">
                  Expires in {daysUntilExpiry} days {canExtend ? "(can extend)" : ""}
                </Text>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
