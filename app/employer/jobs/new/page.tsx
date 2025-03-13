'use client';

import { Card } from '@/app/components/ui/Card';
import { useAuth } from '@/app/components/AuthProvider';
import { Button, Flex, Grid, Heading, Text, TextField, TextArea, Select } from '@radix-ui/themes';
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface JobFormData {
  title: string;
  description: string;
  location: string;
  type: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: string[];
  responsibilities: string[];
}

const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Temporary'
] as const;

const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' }
] as const;

export default function NewJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    location: '',
    type: 'Full-time',
    salary: {
      min: 0,
      max: 0,
      currency: 'USD'
    },
    requirements: [''],
    responsibilities: ['']
  });

  if (!user || user.userType !== 'employer') {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          // Job will expire in 30 days
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          extensionsUsed: 0,
          status: 'active',
          company: {
            name: user.organizationName || '',
            logo: user.companyData?.logo
          }
        })
      });

      if (response.ok) {
        router.push('/employer/jobs');
      } else {
        throw new Error('Failed to create job posting');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  const addListItem = (field: 'requirements' | 'responsibilities') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateListItem = (field: 'requirements' | 'responsibilities', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeListItem = (field: 'requirements' | 'responsibilities', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Heading size="6">Post a New Job</Heading>
        <Text size="2" color="gray">Create a new job posting for your company</Text>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <Flex direction="column" gap="6">
            {/* Basic Information */}
            <div>
              <Text size="3" weight="medium" className="mb-4">Basic Information</Text>
              <Grid columns="2" gap="4">
                <TextField.Root>
                  <TextField.Slot>
                    <input 
                      type="text"
                      placeholder="Job Title"
                      value={formData.title}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                      className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </TextField.Slot>
                </TextField.Root>

                <Select.Root 
                  value={formData.type}
                  onValueChange={value => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    {JOB_TYPES.map(type => (
                      <Select.Item key={type} value={type}>
                        {type}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>

                <TextField.Root>
                  <TextField.Slot>
                    <input 
                      type="text"
                      placeholder="Location"
                      value={formData.location}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      required
                      className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </TextField.Slot>
                </TextField.Root>

                <Select.Root 
                  value={formData.salary.currency}
                  onValueChange={value => setFormData(prev => ({ 
                    ...prev, 
                    salary: { ...prev.salary, currency: value }
                  }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    {CURRENCIES.map(currency => (
                      <Select.Item key={currency.value} value={currency.value}>
                        {currency.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>

                <TextField.Root>
                  <TextField.Slot>
                    <input 
                      type="number"
                      placeholder="Minimum Salary"
                      value={formData.salary.min || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ 
                        ...prev, 
                        salary: { ...prev.salary, min: parseInt(e.target.value) }
                      }))}
                      required
                      className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </TextField.Slot>
                </TextField.Root>

                <TextField.Root>
                  <TextField.Slot>
                    <input 
                      type="number"
                      placeholder="Maximum Salary"
                      value={formData.salary.max || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ 
                        ...prev, 
                        salary: { ...prev.salary, max: parseInt(e.target.value) }
                      }))}
                      required
                      className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </TextField.Slot>
                </TextField.Root>
              </Grid>
            </div>

            {/* Description */}
            <div>
              <Text size="3" weight="medium" className="mb-4">Job Description</Text>
              <TextArea 
                placeholder="Describe the role and responsibilities"
                value={formData.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            {/* Requirements */}
            <div>
              <Flex justify="between" align="center" className="mb-4">
                <Text size="3" weight="medium">Requirements</Text>
                <Button 
                  variant="outline" 
                  onClick={() => addListItem('requirements')}
                  type="button"
                >
                  Add Requirement
                </Button>
              </Flex>
              <Flex direction="column" gap="2">
                {formData.requirements.map((req, index) => (
                  <Flex key={index} gap="2">
                    <TextField.Root className="flex-1">
                      <TextField.Slot>
                        <input 
                          type="text"
                          placeholder="Add a requirement"
                          value={req}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateListItem('requirements', index, e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </TextField.Slot>
                    </TextField.Root>
                    {formData.requirements.length > 1 && (
                      <Button 
                        variant="outline" 
                        color="red" 
                        onClick={() => removeListItem('requirements', index)}
                        type="button"
                      >
                        Remove
                      </Button>
                    )}
                  </Flex>
                ))}
              </Flex>
            </div>

            {/* Responsibilities */}
            <div>
              <Flex justify="between" align="center" className="mb-4">
                <Text size="3" weight="medium">Responsibilities</Text>
                <Button 
                  variant="outline" 
                  onClick={() => addListItem('responsibilities')}
                  type="button"
                >
                  Add Responsibility
                </Button>
              </Flex>
              <Flex direction="column" gap="2">
                {formData.responsibilities.map((resp, index) => (
                  <Flex key={index} gap="2">
                    <TextField.Root className="flex-1">
                      <TextField.Slot>
                        <input 
                          type="text"
                          placeholder="Add a responsibility"
                          value={resp}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateListItem('responsibilities', index, e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </TextField.Slot>
                    </TextField.Root>
                    {formData.responsibilities.length > 1 && (
                      <Button 
                        variant="outline" 
                        color="red" 
                        onClick={() => removeListItem('responsibilities', index)}
                        type="button"
                      >
                        Remove
                      </Button>
                    )}
                  </Flex>
                ))}
              </Flex>
            </div>

            <Flex gap="3" justify="end">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Job Posting'}
              </Button>
            </Flex>
          </Flex>
        </Card>
      </form>
    </div>
  );
}
