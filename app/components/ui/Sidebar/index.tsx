'use client';

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200">
      <nav className="h-full flex flex-col p-4">
        {children}
      </nav>
    </aside>
  );
}
