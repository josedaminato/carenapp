import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setTokens, setOnTokenRefresh } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = '@luz_secreta_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistAuth = useCallback(async (data) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
  }, []);

  const clearAuth = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setTokens(null, null);
    setUser(null);
  }, []);

  useEffect(() => {
    setOnTokenRefresh(async (tokens) => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...data, ...tokens })
        );
      }
    });

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          setTokens(data.accessToken, data.refreshToken);
          const { user: profile } = await api.me();
          setUser(profile);
        }
      } catch {
        await clearAuth();
      } finally {
        setLoading(false);
      }
    })();
  }, [clearAuth]);

  const register = async (email, password, displayName) => {
    const data = await api.register({ email, password, displayName });
    await persistAuth(data);
    return data.user;
  };

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    await persistAuth(data);
    return data.user;
  };

  const logout = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { refreshToken } = JSON.parse(stored);
        await api.logout({ refreshToken });
      }
    } catch {
      // ignore
    }
    await clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
