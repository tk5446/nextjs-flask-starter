'use client';

import { useAuth } from '@/app/components/AuthProvider';
import { Button, DropdownMenu, Flex, Text } from '@radix-ui/themes';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const { user, signOut } = useAuth();
  const isEmployer = user?.userType === 'employer';

  return (
    <header className="h-16 border-b border-gray-200 bg-white">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Marin Jobs"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-lg font-semibold text-gray-900">
              Marin Jobs
            </span>
          </Link>

          {user && (
            <nav className="flex items-center gap-6">
              {isEmployer ? (
                <>
                  <Link 
                    href="/employer/dashboard"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/employer/jobs"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150"
                  >
                    My Jobs
                  </Link>
                  <Link 
                    href="/employer/applications"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150"
                  >
                    Applications
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/jobs"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150"
                  >
                    Find Jobs
                  </Link>
                  <Link 
                    href="/applications"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150"
                  >
                    My Applications
                  </Link>
                  <Link 
                    href="/saved"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150"
                  >
                    Saved Jobs
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Flex gap="4" align="center">
              {isEmployer && (
                <Button asChild>
                  <Link href="/employer/jobs/new">
                    Post a Job
                  </Link>
                </Button>
              )}

              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <button className="flex items-center gap-2 text-sm">
                    {user.companyData?.logo ? (
                      <img
                        src={user.companyData.logo}
                        alt={user.firstName}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <UserCircleIcon className="w-8 h-8 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-700">
                      {user.firstName} {user.lastName}
                    </span>
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content>
                  <DropdownMenu.Item>
                    <Link href={isEmployer ? "/employer/profile" : "/profile"}>
                      Profile
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item color="red" onClick={signOut}>
                    Sign Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Flex>
          ) : (
            <Flex gap="3">
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </Flex>
          )}
        </div>
      </div>
    </header>
  );
}
