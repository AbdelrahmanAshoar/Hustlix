import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hustlix | Premium Freelance Talent',
  description: 'Connect with top-tier freelance talent for your next big project.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
         <Toaster />
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
