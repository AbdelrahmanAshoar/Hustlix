
// app/dashboard/layout.tsx
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Briefcase, 
  MessageSquare, 
  Settings, 
  Bell, 
  LayoutDashboard, 
  Users,
  FileText,
  Star,
  DollarSign,
  Calendar,
  BarChart3,
  Shield,
  UserCog,
  ClipboardList,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import Image from 'next/image';
import logo from "@/assets/images/Hustlix.png";
// Define proper types for navigation items
interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string; // Make badge optional
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userRole, logout, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.fullName) return 'U';
    return user.fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

  // Navigation items based on role with proper typing
  const getNavItems = (): { roleItems: NavItem[]; commonItems: NavItem[] } => {
    const commonItems: NavItem[] = [
      {
        name: 'Messages',
        href: '/dashboard/messages',
        icon: MessageSquare,
        badge: '3' // This is allowed now
      },
      {
        name: 'Notifications',
        href: '/dashboard/notifications',
        icon: Bell,
      },
      {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
      },
    ];

    const roleBasedItems: Record<string, NavItem[]> = {
      Admin: [
        {
          name: 'Overview',
          href: '/dashboard/admin',
          icon: LayoutDashboard,
        },
        {
          name: 'User Management',
          href: '/dashboard/admin/users',
          icon: Users,
        },
        {
          name: 'Analytics',
          href: '/dashboard/admin/analytics',
          icon: BarChart3,
        },
        {
          name: 'Reports',
          href: '/dashboard/admin/reports',
          icon: FileText,
        },
        {
          name: 'System Settings',
          href: '/dashboard/admin/system',
          icon: Shield,
        },
      ],
      Client: [
        {
          name: 'Dashboard',
          href: '/dashboard/client',
          icon: LayoutDashboard,
        },

        {
          name: 'Post Project',
          href: '/dashboard/client/addProject',
          icon: ClipboardList,
        },
        {
          name: 'Find Freelancers',
          href: '/find-talent',
          icon: Users,
        },
        {
          name: 'Payments',
          href: '/dashboard/client/payments',
          icon: DollarSign,
        },
      ],
      Freelancer: [
        {
          name: 'Dashboard',
          href: '/dashboard/freelancer',
          icon: LayoutDashboard,
        },
        {
          name: 'Available Projects',
          href: '/projects',
          icon: Briefcase,
        },
        {
          name: 'My Applications',
          href: '/dashboard/freelancer/applications',
          icon: FileText,
        },
        {
          name: 'Active Projects',
          href: '/dashboard/freelancer/active-projects',
          icon: Calendar,
        },
        {
          name: 'Earnings',
          href: '/dashboard/freelancer/earnings',
          icon: DollarSign,
        },
        {
          name: 'Reviews',
          href: '/dashboard/freelancer/reviews',
          icon: Star,
        },
      ],
    };

    const items = roleBasedItems[userRole as string] || [];
    return { roleItems: items, commonItems };
  };

  const { roleItems, commonItems } = getNavItems();

  // Check if a link is active
  const isActive = (href: string) => {
    if (href === '/dashboard/admin' && pathname === '/dashboard/admin') return true;
    if (href === '/dashboard/client' && pathname === '/dashboard/client') return true;
    if (href === '/dashboard/freelancer' && pathname === '/dashboard/freelancer') return true;
    return pathname.startsWith(href) && href !== '/dashboard/admin' && href !== '/dashboard/client' && href !== '/dashboard/freelancer';
  };

  // Role display configuration
  const roleConfig: Record<string, { color: string; label: string }> = {
    Admin: { color: 'bg-purple-100 text-purple-700', label: 'Administrator' },
    Client: { color: 'bg-blue-100 text-blue-700', label: 'Client' },
    Freelancer: { color: 'bg-green-100 text-green-700', label: 'Freelancer' },
  };

  const currentRoleConfig = roleConfig[userRole as string] || roleConfig.Client;

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b">
          <Link href="/" className="font-bold text-xl text-primary tracking-tight">
            <Image src={logo} alt="logo" width={120} height={120}/>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${currentRoleConfig.color} font-medium`}>
              {currentRoleConfig.label}
            </span>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {/* Role-specific navigation */}
          <div className="text-xs uppercase font-semibold text-muted-foreground mb-4 mt-2 px-2">
            {userRole} Menu
          </div>
          
          <nav className="space-y-1">
            {roleItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                  {item.badge && (
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                      active ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="text-xs uppercase font-semibold text-muted-foreground mb-4 mt-8 px-2">
            General
          </div>
          <nav className="space-y-1">
            {commonItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                  {item.badge && (
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                      active ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* User Profile Section */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profilePictureUrl || ''} alt={user?.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={logout}
              className="h-8 w-8 text-muted-foreground hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden border-b bg-card p-4 flex justify-between items-center sticky top-0 z-10">
          <Link href="/" className="font-bold text-xl text-primary tracking-tight">
            Hustlix
          </Link>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${currentRoleConfig.color} font-medium`}>
              {userRole}
            </span>
            <Button variant="outline" size="sm">Menu</Button>
          </div>
        </header>

        <div className="p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}