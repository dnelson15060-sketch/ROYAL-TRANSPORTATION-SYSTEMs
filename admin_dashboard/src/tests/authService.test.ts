import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockAuthInstance = { currentUser: null };

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: 'mock-app' })),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => mockAuthInstance),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(() => vi.fn()),
}));

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirebaseAuth,
  login,
  logout,
  subscribeToAuthChanges,
} from '../services/authService';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes the Firebase app only once and returns the auth instance', () => {
    const auth1 = getFirebaseAuth();
    const auth2 = getFirebaseAuth();

    expect(initializeApp).toHaveBeenCalledTimes(1);
    expect(getAuth).toHaveBeenCalledTimes(1);
    expect(auth1).toBe(auth2);
    expect(auth1).toBe(mockAuthInstance);
  });

  it('signs a user in with email and password', async () => {
    const mockUser = { uid: 'abc123', email: 'admin@royal.com' };
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
      user: mockUser,
    } as never);

    const user = await login('admin@royal.com', 'password123');

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuthInstance,
      'admin@royal.com',
      'password123'
    );
    expect(user).toEqual(mockUser);
  });

  it('signs the current user out', async () => {
    vi.mocked(signOut).mockResolvedValue(undefined);

    await logout();

    expect(signOut).toHaveBeenCalledWith(mockAuthInstance);
  });

  it('subscribes to auth state changes', () => {
    const callback = vi.fn();
    subscribeToAuthChanges(callback);

    expect(onAuthStateChanged).toHaveBeenCalledWith(mockAuthInstance, callback);
  });
});
