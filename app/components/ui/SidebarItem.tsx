import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const cn = (...inputs: any[]) => twMerge(clsx(inputs));

export function SidebarItem({ href, icon, label }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href}
      className={cn(
        'flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out',
        isActive 
          ? 'text-primary bg-primary/10' 
          : 'text-gray-600 hover:text-primary hover:bg-primary/5'
      )}
    >
      <span className="w-5 h-5 mr-3">{icon}</span>
      {label}
    </Link>
  );
}
