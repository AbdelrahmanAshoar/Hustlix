import {
  Bell,
  Briefcase,
  Calendar,
  ClipboardList,
  DollarSign,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
  Sparkles,
  Star,
  Users,
  BarChart3,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface RoleDisplayConfig {
  color: string;
  label: string;
}

export const COMMON_NAV_ITEMS: NavItem[] = [
  {
    name: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
    badge: '3',
  },
  
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

const ROLE_NAV_ITEMS: Record<string, NavItem[]> = {
  Admin: [
    { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
    { name: 'Disputes', href: '/dashboard/admin/disputes', icon: AlertCircle },
    { name: 'AI Matching', href: '/dashboard/admin', icon: Sparkles, badge: 'AI' },
    { name: 'System Settings', href: '/dashboard/admin/system', icon: Shield },
  ],
  Client: [
    { name: 'Dashboard', href: '/dashboard/client', icon: LayoutDashboard },
    { name: 'Post Project', href: '/dashboard/client/addProject', icon: ClipboardList },
    { name: 'Find Freelancers', href: '/find-talent', icon: Users },
    { name: 'Payments', href: '/dashboard/client/payments', icon: DollarSign },
  ],
  Freelancer: [
    { name: 'Dashboard', href: '/dashboard/freelancer', icon: LayoutDashboard },
    { name: 'Available Projects', href: '/projects', icon: Briefcase },
    { name: 'AI Matched Projects', href: '/dashboard/freelancer/suggested-projects', icon: Sparkles, badge: 'AI' },
    { name: 'My Applications', href: '/dashboard/freelancer/applications', icon: FileText },
    { name: 'Active Projects', href: '/dashboard/freelancer/active-projects', icon: Calendar },
    { name: 'Earnings', href: '/dashboard/freelancer/earnings', icon: DollarSign },
    { name: 'Reviews', href: '/dashboard/freelancer/reviews', icon: Star },
  ],
};

export const ROLE_DISPLAY_CONFIG: Record<string, RoleDisplayConfig> = {
  Admin: { color: 'bg-purple-100 text-purple-700', label: 'Administrator' },
  Client: { color: 'bg-blue-100 text-blue-700', label: 'Client' },
  Freelancer: { color: 'bg-green-100 text-green-700', label: 'Freelancer' },
};

export function getRoleNavItems(userRole: string | null | undefined): NavItem[] {
  if (!userRole) return [];
  return ROLE_NAV_ITEMS[userRole] || [];
}

export function getRoleDisplayConfig(userRole: string | null | undefined): RoleDisplayConfig {
  if (!userRole) return ROLE_DISPLAY_CONFIG.Client;
  return ROLE_DISPLAY_CONFIG[userRole] || ROLE_DISPLAY_CONFIG.Client;
}

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === '/dashboard/admin' && pathname === '/dashboard/admin') return true;
  if (href === '/dashboard/client' && pathname === '/dashboard/client') return true;
  if (href === '/dashboard/freelancer' && pathname === '/dashboard/freelancer') return true;
  return (
    pathname.startsWith(href) &&
    href !== '/dashboard/admin' &&
    href !== '/dashboard/client' &&
    href !== '/dashboard/freelancer'
  );
}
