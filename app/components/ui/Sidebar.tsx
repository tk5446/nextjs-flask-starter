import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
  className?: string;
}

interface SidebarItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
}

export function Sidebar({ children, className }: SidebarProps) {
  return (
    <nav className={cn('w-64 bg-white border-r border-gray-200 h-screen', className)}>
      <div className="p-4 flex flex-col h-full">
        {children}
      </div>
    </nav>
  );
}

export function SidebarItem({ href, icon, label, active }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = active || pathname === href;

  return (
    <Link 
      href={href}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ease-in-out',
        isActive 
          ? 'bg-primary text-white' 
          : 'text-gray-600 hover:bg-gray-50'
      )}
    >
      <span className="w-5 h-5">{icon}</span>
      {label}
    </Link>
  );
}
