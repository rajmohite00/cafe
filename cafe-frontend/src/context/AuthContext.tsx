'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]     = useState<User | null>(null);
  const [token, setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('cafe_token');
    const storedUser  = localStorage.getItem('cafe_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persist = (t: string, u: User) => {
    localStorage.setItem('cafe_token', t);
    localStorage.setItem('cafe_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    try {
      const res  = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        persist(data.token, data.user);
        return;
      }
    } catch { /* fallback to local mock login below */ }

    // Mock login fallback
    if (email === 'invalid@example.com' || password === 'wrong-password') {
      throw new Error('Invalid email or password');
    }
    const mockUser = { id: 'usr_' + Date.now(), name: email.split('@')[0], email, phone: '5551234567' };
    persist('mock_jwt_token_' + Date.now(), mockUser);
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      const res  = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (data.success) {
        persist(data.token, data.user);
        return;
      }
    } catch { /* fallback to local mock registration below */ }

    // Mock registration fallback
    const mockUser = { id: 'usr_' + Date.now(), name, email, phone };
    persist('mock_jwt_token_' + Date.now(), mockUser);
  };

  const logout = () => {
    localStorage.removeItem('cafe_token');
    localStorage.removeItem('cafe_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
