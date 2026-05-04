'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CrmAuthContextType {
  password: string;
  isLoggedIn: boolean;
  login: (pw: string) => void;
  logout: () => void;
}

const CrmAuthContext = createContext<CrmAuthContextType | null>(null);

export function CrmAuthProvider({ children }: { children: ReactNode }) {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('crm_pw');
    if (saved) {
      setPassword(saved);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (pw: string) => {
    sessionStorage.setItem('crm_pw', pw);
    setPassword(pw);
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.removeItem('crm_pw');
    setPassword('');
    setIsLoggedIn(false);
  };

  return (
    <CrmAuthContext.Provider value={{ password, isLoggedIn, login, logout }}>
      {children}
    </CrmAuthContext.Provider>
  );
}

export function useCrmAuth() {
  const ctx = useContext(CrmAuthContext);
  if (!ctx) throw new Error('useCrmAuth must be used within CrmAuthProvider');
  return ctx;
}
