'use client';

import { AuthProvider } from '@/app/components/AuthProvider';
import { Theme } from '@radix-ui/themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Theme>{children}</Theme>
    </AuthProvider>
  );
}
