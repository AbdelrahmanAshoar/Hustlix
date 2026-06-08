
// app/dashboard/layout.tsx
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardMobileHeader from '@/components/dashboard/DashboardMobileHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userRole, logout, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex-1 min-h-screen bg-muted/20 md:grid md:grid-cols-[16rem_minmax(0,1fr)] md:overflow-hedden">
      <DashboardSidebar
        user={user}
        userRole={userRole}
        pathname={pathname}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <main className="min-w-0 flex flex-col h-screen md:h-screen md:max-h-screen">
        <DashboardMobileHeader userRole={userRole} />

        <div className="flex-1 overflow-y-scroll p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
