import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser } from '../api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    const login = useCallback(async (credentials) => {
        const res = await loginUser(credentials);
        const jwt = res.data.token || res.data.jwt || res.data.accessToken;
        const userInfo = res.data.user || {
            email: credentials.email,
            role: res.data.role || 'USER',
            id: res.data.userId || res.data.id
        };
        if (jwt) {
            localStorage.setItem('token', jwt);
            setToken(jwt);
        }
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
        return userInfo;
    }, []);

    const register = useCallback(async (payload) => {
        const res = await registerUser(payload);
        return res.data;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
