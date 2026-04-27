import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export type User = {
  user_id: string;
  email: string;
  name: string;
  picture: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  processSessionId: (sessionId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

// On web: use relative URL so same-origin requests work with cookies
// On native: use full BACKEND_URL with Authorization header
function getApiUrl(path: string): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return path; // relative URL → same origin → cookies work
  }
  return `${BACKEND_URL}${path}`;
}

async function authFetch(path: string, options: RequestInit = {}) {
  const url = getApiUrl(path);
  const token = await AsyncStorage.getItem('session_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // On web with same-origin, include credentials so cookies are sent
  const useCredentials = Platform.OS === 'web';

  return fetch(url, {
    ...options,
    headers,
    ...(useCredentials ? { credentials: 'include' as RequestCredentials } : {}),
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const hasChecked = useRef(false);

  const processSessionId = useCallback(async (sessionId: string) => {
    try {
      const url = getApiUrl('/api/auth/session');
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
        ...(Platform.OS === 'web' ? { credentials: 'include' as RequestCredentials } : {}),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        if (data.session_token) {
          await AsyncStorage.setItem('session_token', data.session_token);
        }
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Session exchange failed:', error);
    }
  }, [router]);

  const checkAuth = useCallback(async () => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    try {
      // Skip auth check if returning from OAuth on web
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        if (window.location.hash?.includes('session_id=')) {
          setIsLoading(false);
          return;
        }
      }

      const response = await authFetch('/api/auth/me');

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
        await AsyncStorage.removeItem('session_token');
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
      const redirectUrl = window.location.origin + '/auth-callback';
      window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
    } else {
      const redirectUri = Linking.createURL('/auth-callback');
      const authUrl = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUri)}`;
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      if (result.type === 'success' && result.url) {
        const hash = result.url.split('#')[1];
        if (hash) {
          const params = new URLSearchParams(hash);
          const sessionId = params.get('session_id');
          if (sessionId) {
            await processSessionId(sessionId);
          }
        }
      }
    }
  }, [processSessionId]);

  const logout = useCallback(async () => {
    try {
      await authFetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      await AsyncStorage.removeItem('session_token');
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, processSessionId }}>
      {children}
    </AuthContext.Provider>
  );
}
