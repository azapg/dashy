import React, {createContext, useState, useContext, useEffect, ReactNode} from 'react';
import {useRouter} from 'next/router';

interface User {
  user_id: number;
  username: string;
  email: string;
  role_id?: number;
  expires_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
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
  const router = useRouter();

  useEffect(() => {
    try {
      const userInfoCookie = getCookie('user_info');
      if (userInfoCookie) {
        try {
          const parsedUser: User = JSON.parse(userInfoCookie);
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

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<{
    success: boolean;
    error?: string
  }> => {
    try {
      const res = await fetch('/api/auth/login.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password, remember_me: rememberMe}),
      });

      const data: { success: boolean; data?: User; error?: string } = await res.json();

      if (!res.ok) {
        return {success: false, error: "Server responded with error"}
      }

      if (data.success && data.data) {
        setUser(data.data);
        return {success: true};
      } else {
        return {success: false, error: "Unknown error"}
      }
    } catch (error) {
      console.error('Login failed:', error);
      return {success: false, error: "idk"};
    }
  };

  const register = async (username: string, email: string, password: string): Promise<{
    success: boolean;
    error?: string
  }> => {
    try {
      const res = await fetch('/api/auth/register.php', {
        method: 'POST',
        credentials: 'include', // Important for receiving cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, email, password}),
      });

      const data: { success: boolean; data?: User; error?: string } = await res.json();

      if (!res.ok) {
        return {success: false, error: "Server responded with error"}
      }

      if (data.success && data.data) {
        setUser(data.data);
        return {success: true};
      } else {
        return {success: false, error: "Unknown error"}
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return {success: false, error: "Unknown error"}
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout.php', {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);
      await router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
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