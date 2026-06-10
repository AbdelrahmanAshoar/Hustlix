// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  bio: string | null;
  role: string;
  profilePictureUrl: string | null ;
  
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  userRole: string | null;
  login: (token: string, user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  isLoading: boolean;
}

const TOKEN_COOKIE_NAME = 'token';

const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const getAuthToken = (): string | null => getCookie(TOKEN_COOKIE_NAME);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on mount
    const storedToken = getAuthToken();
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    
    // Store in cookie for middleware/API routes
    document.cookie = `${TOKEN_COOKIE_NAME}=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    
    // Store user in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      const updatedUser = { ...currentUser, ...updates };
      try {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Failed to update stored user:', error);
      }
      return updatedUser;
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    
    // Clear cookie
    document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    
    // Clear localStorage
    localStorage.removeItem('user');
    
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      isAuthenticated: !!token && !!user,
      userRole: user?.role || null,
      login,
      updateUser,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}