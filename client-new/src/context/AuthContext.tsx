import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import * as authAPI from '../services/authAPI';

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('brx_token');
    const savedUser = localStorage.getItem('brx_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Save to state
        setUser(user);
        setToken(token);

        // Save to localStorage
        localStorage.setItem('brx_token', token);
        localStorage.setItem('brx_user', JSON.stringify(user));
      } else {
        throw new Error(response.message || 'Échec de la connexion');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const response = await authAPI.register({ email, password, name });

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Save to state
        setUser(user);
        setToken(token);

        // Save to localStorage
        localStorage.setItem('brx_token', token);
        localStorage.setItem('brx_user', JSON.stringify(user));
      } else {
        throw new Error(response.message || 'Échec de l\'inscription');
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      loginUser,
      registerUser,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
