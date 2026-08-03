import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from '../contexts/AuthContext';

/**
 * Access the current authenticated admin's state and auth actions.
 * Must be used within an <AuthProvider>.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
