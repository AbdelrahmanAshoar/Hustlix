"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getRoleDisplayConfig } from './config';

interface DashboardMobileHeaderProps {
  userRole: string | null;
}

export default function DashboardMobileHeader({ userRole }: DashboardMobileHeaderProps) {
  const roleBadge = getRoleDisplayConfig(userRole);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-card p-4 md:hidden">
      <Link href="/" className="text-xl font-bold tracking-tight text-primary">
        Hustlix
      </Link>
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${roleBadge.color}`}>
          {userRole || 'User'}
        </span>
        <Button variant="outline" size="sm">
          Menu
        </Button>
      </div>
    </header>
  );
}
