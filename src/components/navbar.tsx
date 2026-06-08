// components/Navbar.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import logo from "@/assets/images/Hustlix.png";
export function Navbar() {
  const { isAuthenticated, user, userRole, logout } = useAuth();

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.fullName) return 'U';
    return user.fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-2xl text-primary tracking-tight">
            <Image src={logo} width={120} height={120} alt={"logo"}/>
          </Link>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
            {!isAuthenticated ? (
              <>
                <Link href="/find-talent" className="hover:text-foreground transition-colors">Find Talent</Link>
                <Link href="/projects" className="hover:text-foreground transition-colors">Find Work</Link>
              </>
            ) : (
              <>
                {userRole !== 'Freelancer' && (
                  <Link href="/find-talent" className="hover:text-foreground transition-colors">Find Talent</Link>
                )}
                {userRole !== 'Client' && (
                  <Link href="/projects" className="hover:text-foreground transition-colors">Find Work</Link>
                )}
              </>
            )}
            <Link href="/why-hustlix" className="hover:text-foreground transition-colors">Why Hustlix</Link>
            {/* <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link> */}
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-sm mx-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search skills, freelancers, projects..." 
            className="w-full h-10 pl-9 pr-4 rounded-full bg-muted/50 border-none focus:ring-2 focus:ring-primary focus:outline-none text-sm transition-all"
          />
        </div>

        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            // Show login/signup buttons when NOT logged in
            <>
              <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
                Log In
              </Link>
              <Link href="/auth/register">
                <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-shadow">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            // Show user menu when logged in
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profilePictureUrl || ''} alt={user?.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground mt-1">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {userRole}
                      </span>
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Role-based menu items */}
                {userRole === 'Admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/admin" className="cursor-pointer flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {userRole === 'Client' && (
                  <DropdownMenuItem asChild>
                    { <Link href="/dashboard/client" className="cursor-pointer flex items-center" 
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link> }
                  </DropdownMenuItem>
                )}
                
                {userRole === 'Freelancer' && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/freelancer" className="cursor-pointer flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
