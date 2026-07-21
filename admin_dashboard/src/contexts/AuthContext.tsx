import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import api from '../services/api';
import {
  login as firebaseLogin,
  logout as firebaseLogout,
  subscribeToAuthChanges,
} from '../services/authService';
import type { User } from '../types';

export interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  profile: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const { data } = await api.get<{ success: boolean; data: User }>(
            `/users/${user.uid}`
          );
          setProfile(data.data);
        } catch {
          // Fall back to a minimal profile derived from the Firebase user
          // if the backend profile lookup fails (e.g. network issue).
          setProfile({
            uid: user.uid,
            email: user.email ?? '',
            name: user.displayName ?? user.email ?? 'Admin',
            role: 'admin',
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      profile,
      loading,
      isAdmin: profile?.role === 'admin',
      login: async (email: string, password: string) => {
        await firebaseLogin(email, password);
      },
      logout: async () => {
        await firebaseLogout();
      },
    }),
    [firebaseUser, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
