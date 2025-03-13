import { Card } from '@/app/components/ui/Card';
import { Button, Select, Slider, Switch, TextField } from '@radix-ui/themes';
import { useState, useEffect, ChangeEvent } from 'react';

interface JobFilters {
  locations: string[];
  jobTypes: string[];
  experienceLevels: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  remoteOnly: boolean;
}

interface JobFiltersProps {
  initialFilters?: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
}

const DEFAULT_FILTERS: JobFilters = {
  locations: [],
  jobTypes: [],
  experienceLevels: [],
  salaryRange: {
    min: 0,
    max: 200000,
  },
  remoteOnly: false,
};

const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Temporary',
];

const EXPERIENCE_LEVELS = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Lead',
  'Executive',
];

export function JobFilters({ initialFilters = DEFAULT_FILTERS, onFiltersChange }: JobFiltersProps) {
  const [filters, setFilters] = useState<JobFilters>(initialFilters);
  const [isSticky, setIsSticky] = useState(false);

  // Handle sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 64); // Start sticking after header height
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (updates: Partial<JobFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div 
      className={`transition-all duration-150 ease-in-out ${
        isSticky ? 'sticky top-0 z-10 pt-4 -mx-4 px-4 bg-background' : ''
      }`}
    >
      <Card className="p-4">
        <div className="space-y-6">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <TextField.Root>
              <TextField.Slot>
                <input 
                  type="text"
                  placeholder="Search locations..."
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    if (value && !filters.locations.includes(value)) {
                      handleFilterChange({
                        locations: [...filters.locations, value]
                      });
                    }
                  }}
                />
              </TextField.Slot>
            </TextField.Root>
            {filters.locations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.locations.map(location => (
                  <Button
                    key={location}
                    size="1"
                    variant="soft"
                    onClick={() => {
                      handleFilterChange({
                        locations: filters.locations.filter(l => l !== location)
                      });
                    }}
                  >
                    {location} ×
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <Select.Root 
              value={filters.jobTypes[0] || ''} 
              onValueChange={(value) => {
                if (value && !filters.jobTypes.includes(value)) {
                  handleFilterChange({
                    jobTypes: [...filters.jobTypes, value]
                  });
                }
              }}
            >
              <Select.Trigger placeholder="Select job type" />
              <Select.Content>
                {JOB_TYPES.map(type => (
                  <Select.Item key={type} value={type}>
                    {type}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            {filters.jobTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.jobTypes.map(type => (
                  <Button
                    key={type}
                    size="1"
                    variant="soft"
                    onClick={() => {
                      handleFilterChange({
                        jobTypes: filters.jobTypes.filter(t => t !== type)
                      });
                    }}
                  >
                    {type} ×
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <Select.Root 
              value={filters.experienceLevels[0] || ''} 
              onValueChange={(value) => {
                if (value && !filters.experienceLevels.includes(value)) {
                  handleFilterChange({
                    experienceLevels: [...filters.experienceLevels, value]
                  });
                }
              }}
            >
              <Select.Trigger placeholder="Select experience level" />
              <Select.Content>
                {EXPERIENCE_LEVELS.map(level => (
                  <Select.Item key={level} value={level}>
                    {level}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            {filters.experienceLevels.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.experienceLevels.map(level => (
                  <Button
                    key={level}
                    size="1"
                    variant="soft"
                    onClick={() => {
                      handleFilterChange({
                        experienceLevels: filters.experienceLevels.filter(l => l !== level)
                      });
                    }}
                  >
                    {level} ×
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Salary Range: ${filters.salaryRange.min.toLocaleString()} - ${filters.salaryRange.max.toLocaleString()}
            </label>
            <Slider 
              value={[filters.salaryRange.min, filters.salaryRange.max]}
              min={0}
              max={200000}
              step={10000}
              onValueChange={([min, max]) => {
                handleFilterChange({
                  salaryRange: { min, max }
                });
              }}
            />
          </div>

          {/* Remote Only */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Remote Only
            </label>
            <Switch
              checked={filters.remoteOnly}
              onCheckedChange={(checked) => {
                handleFilterChange({
                  remoteOnly: checked
                });
              }}
            />
          </div>
        </div>

        {/* Reset Filters */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleFilterChange(DEFAULT_FILTERS)}
          >
            Reset Filters
          </Button>
        </div>
      </Card>
    </div>
  );
}
