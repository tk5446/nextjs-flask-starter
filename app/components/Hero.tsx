'use client';

import { Button, Flex, Heading, Text, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState, ChangeEvent, KeyboardEvent } from 'react';

interface HeroProps {
  onSearch: (query: string) => void;
}

export function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="text-center">
      <Heading size="8" className="mb-4">
        Find Your Next Career Opportunity
      </Heading>
      <Text size="4" color="gray" className="mb-8">
        Browse through thousands of job opportunities in Marin County
      </Text>

      <Flex justify="center" gap="3">
        <TextField.Root size="3" className="w-full max-w-md">
          <TextField.Slot>
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </TextField.Slot>
          <TextField.Slot>
            <input 
              type="text"
              placeholder="Search jobs by title, company, or keyword..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
            />
          </TextField.Slot>
        </TextField.Root>
        <Button size="3" onClick={handleSearch}>
          Search
        </Button>
      </Flex>
    </div>
  );
}