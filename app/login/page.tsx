'use client';

import { Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { BriefcaseIcon, UserIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (type: 'employer' | 'job_seeker') => {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/login?type=${type}`);
      const data = await response.json();
      
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (error) {
      console.error('Failed to initiate login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-16">
      <div className="text-center mb-8">
        <Heading size="8" className="mb-2">Welcome to Marin Jobs</Heading>
        <Text size="3" color="gray">Choose how you want to continue</Text>
      </div>

      <Flex direction="column" gap="4">
        <Card 
          className="p-6 cursor-pointer hover:border-blue-500 transition-colors duration-150"
          onClick={() => handleLogin('job_seeker')}
        >
          <Flex gap="4" align="center">
            <div className="p-3 rounded-full bg-blue-50">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <Text weight="medium" size="4">I'm looking for a job</Text>
              <Text color="gray" size="2">
                Search and apply for jobs in Marin County
              </Text>
            </div>
          </Flex>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover:border-blue-500 transition-colors duration-150"
          onClick={() => handleLogin('employer')}
        >
          <Flex gap="4" align="center">
            <div className="p-3 rounded-full bg-blue-50">
              <BriefcaseIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <Text weight="medium" size="4">I'm hiring</Text>
              <Text color="gray" size="2">
                Post jobs and find great talent in Marin County
              </Text>
            </div>
          </Flex>
        </Card>
      </Flex>

      <Text size="2" color="gray" align="center" className="mt-8">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </div>
  );
}
