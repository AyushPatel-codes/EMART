import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/services';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

/** NOTE: localStorage only remembers who is logged in for the UI. Every API call is re-authorised by the backend. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('emart_user')); } catch { return null; } });

  const clear = useCallback(() => {
    localStorage.removeItem('emart_token'); localStorage.removeItem('emart_user'); setUser(null);
  }, []);
  useEffect(() => {
    window.addEventListener('emart:logout', clear);
    return () => window.removeEventListener('emart:logout', clear);
  }, [clear]);

  const login = useCallback((data) => {
    const u = { id: data.userId, name: data.name, email: data.email, role: data.role, status: data.status };
    localStorage.setItem('emart_token', data.token);
    localStorage.setItem('emart_user', JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => { try { await authApi.logout(); } catch { /* ignore */ } clear(); }, [clear]);
  const patchUser = useCallback((patch) => setUser((u) => {
    const n = { ...u, ...patch }; localStorage.setItem('emart_user', JSON.stringify(n)); return n;
  }), []);

  return <AuthContext.Provider value={{ user, login, logout, patchUser }}>{children}</AuthContext.Provider>;
}
