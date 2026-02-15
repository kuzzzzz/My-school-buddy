import { createContext, useContext, useMemo, useState } from 'react';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('ucc_token'));

  const setToken = (value: string | null) => {
    setTokenState(value);
    if (value) {
      localStorage.setItem('ucc_token', value);
    } else {
      localStorage.removeItem('ucc_token');
    }
  };

  const value = useMemo(() => ({ token, setToken }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
