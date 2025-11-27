import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Inter } from 'next/font/google';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NinthImage - AI Video Generation',
  description: 'Generate stunning videos with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkPk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider publishableKey={clerkPk}>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
