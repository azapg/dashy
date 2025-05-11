'use client';

import React, {createContext, useState, useContext, useEffect, ReactNode} from 'react';
import {loginRequest, logoutRequest, registerRequest} from "@/api/auth";
import {ApiResponse, User} from '@/api/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<ApiResponse>;
  register: (username: string, email: string, password: string) => Promise<ApiResponse>;
  logout: () => Promise<ApiResponse>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const userInfoCookie = getCookie('user_info');
      if (userInfoCookie) {
        try {
          const decoded = decodeURIComponent(userInfoCookie);
          const parsedUser: User = JSON.parse(decoded);
          setUser(parsedUser);
        } catch (e) {
          console.error('Failed to parse user_info cookie', e);
        }
      }

      fetch('/api/auth/verify_session.php', {
        credentials: 'include',
      }).then(async (res) => {
        if (res.ok) {
          const data: { success: boolean; data?: User } = await res.json();
          if (data.success && data.data) {
            setUser(data.data);
          } else {
            if (userInfoCookie) {
              setUser(null);
            }
          }
        } else {
          setUser(null);
        }
      }).catch(error => {
        console.error('Auth check failed:', error);
      }).finally(() => {
        setLoading(false)
      })
    } catch (error) {
      console.error('Auth check failed:', error);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<ApiResponse> => {
    const response = await loginRequest({email, password, rememberMe});

    if (response.success && response.data) {
      setUser(response.data as User);
    } else {
      setUser(null);
    }

    return response;
  };

  const register = async (username: string, email: string, password: string): Promise<ApiResponse> => {
    const response = await registerRequest({username, email, password});

    if (response.success && response.data) {
      setUser(response.data as User);
    } else {
      setUser(null);
    }

    return response;
  };

  const logout = async () => {
    const response = await logoutRequest();

    if(response.success) {
      setUser(null);
    }

    return response;
  };

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role_id === 1,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};