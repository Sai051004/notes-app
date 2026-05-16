import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service.js';
import { STORAGE_KEYS } from '../constants/index.js';
import { isTokenExpired } from '../utils/token.js';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (token && isTokenExpired(token)) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setLoading(false);
      return;
    }

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    setLoading(false);
  }, []);

  const persistAuth = useCallback((credentials, accessToken) => {
    const authUser = { email: credentials.email };
    localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    persistAuth(credentials, data.access_token);
    toast.success('Welcome back!');
    return { user: { email: credentials.email }, token: data.access_token };
  };

  const register = async (credentials) => {
    await authService.register(credentials);
    const result = await login(credentials);
    toast.success('Account created successfully!');
    return result;
  };

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    toast.info('Logged out');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
