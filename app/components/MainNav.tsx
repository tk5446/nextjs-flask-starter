'use client';

import { useAuth } from '@/app/components/AuthProvider';
import { Sidebar } from '@/app/components/ui/Sidebar';
import { SidebarItem } from '@/app/components/ui/SidebarItem';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  EnvelopeIcon, 
  UserIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

export function MainNav() {
  const { user } = useAuth();
  const isEmployer = user?.userType === 'employer';

  return (
    <Sidebar>
      <div className="flex-1">
        {isEmployer ? (
          <>
            <SidebarItem href="/employer/dashboard" icon={<HomeIcon />} label="Dashboard" />
            <SidebarItem href="/employer/jobs" icon={<BriefcaseIcon />} label="Job Postings" />
            <SidebarItem href="/employer/applications" icon={<EnvelopeIcon />} label="Applications" />
            <SidebarItem href="/employer/profile" icon={<UserIcon />} label="Company Profile" />
          </>
        ) : (
          <>
            <SidebarItem href="/dashboard" icon={<HomeIcon />} label="Dashboard" />
            <SidebarItem href="/jobs" icon={<BriefcaseIcon />} label="Find Jobs" />
            <SidebarItem href="/applications" icon={<EnvelopeIcon />} label="My Applications" />
            <SidebarItem href="/profile" icon={<UserIcon />} label="Profile" />
          </>
        )}
      </div>
      <div className="border-t border-gray-200 pt-4 mt-4">
        <SidebarItem href="/settings" icon={<Cog6ToothIcon />} label="Settings" />
      </div>
    </Sidebar>
  );
}
