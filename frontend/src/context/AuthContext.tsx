import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import API from '../lib/api';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthCtx {
  user: AdminUser | null | false; // null = checking, false = not authed
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null | false>(null);

  useEffect(() => {
    API.get('/auth/me')
      .then((r) => setUser(r.data))
      .catch(() => setUser(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await API.post('/auth/login', { email, password });
    setUser(data);
  };

  const logout = async () => {
    await API.post('/auth/logout');
    setUser(false);
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
