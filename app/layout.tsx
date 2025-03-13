import '@/app/globals.css';
import { Inter } from 'next/font/google';
import '@radix-ui/themes/styles.css';
import { Header } from '@/app/components/Header';
import { MainNav } from '@/app/components/MainNav';
import { Providers } from '@/app/components/Providers';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marin Jobs",
  description: "Job board platform for employers and job seekers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#f8fafc]">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <div className="flex h-full">
            <MainNav />
            <main className="flex-1 overflow-y-auto">
              <Header />
              <div className="p-6">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
