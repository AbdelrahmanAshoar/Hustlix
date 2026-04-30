"use client";

import Image from 'next/image';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { User } from '@/contexts/AuthContext';
import logo from '@/assets/images/Hustlix.png';
import {
  COMMON_NAV_ITEMS,
  getRoleDisplayConfig,
  getRoleNavItems,
  isNavItemActive,
  type NavItem,
} from './config';

interface DashboardSidebarProps {
  user: User | null;
  userRole: string | null;
  pathname: string;
  onLogout: () => void;
}

function getInitials(fullName?: string | null): string {
  if (!fullName) return 'U';
  return fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function NavSection({
  items,
  pathname,
}: {
  items: NavItem[];
  pathname: string;
}) {
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isNavItemActive(pathname, item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.name}
            {item.badge && (
              <span
                className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${
                  active ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardSidebar({
  user,
  userRole,
  pathname,
  onLogout,
}: DashboardSidebarProps) {
  const roleItems = getRoleNavItems(userRole);
  const currentRoleConfig = getRoleDisplayConfig(userRole);

  return (
    <aside className="hidden flex-col border-r bg-card md:sticky md:top-0 md:flex md:h-screen">
      <div className="border-b p-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-primary">
          <Image src={logo} alt="logo" width={120} height={120} />
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${currentRoleConfig.color}`}>
            {currentRoleConfig.label}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        <div className="mb-4 mt-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
          {userRole} Menu
        </div>
        <NavSection items={roleItems} pathname={pathname} />

        <div className="mb-4 mt-8 px-2 text-xs font-semibold uppercase text-muted-foreground">
          General
        </div>
        <NavSection items={COMMON_NAV_ITEMS} pathname={pathname} />
      </div>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.profilePictureUrl || ''} alt={user?.fullName} />
            <AvatarFallback className="bg-primary/10 text-primary">{getInitials(user?.fullName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="h-8 w-8 text-muted-foreground hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
