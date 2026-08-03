import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface LoginFormValues {
  email: string;
  password: string;
}

const FRIENDLY_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/too-many-requests':
    'Too many failed attempts. Please try again later.',
};

export function LoginPage() {
  const { login, firebaseUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
  });

  if (!loading && firebaseUser) {
    const redirectTo =
      (location.state as { from?: string } | null)?.from ?? '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  async function onSubmit(values: LoginFormValues) {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      if (error instanceof FirebaseError) {
        setAuthError(
          FRIENDLY_ERROR_MESSAGES[error.code] ??
            'Unable to sign in. Please check your credentials and try again.'
        );
      } else {
        setAuthError('Unable to sign in. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl text-white">
            🚍
          </div>
          <h1 className="text-xl font-bold text-primary">
            Royal Transportation System
          </h1>
          <p className="mt-1 text-sm text-gray-500">Admin Dashboard Login</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="admin@royaltransport.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />

          {authError && (
            <div
              role="alert"
              className="rounded-md bg-accent-50 px-3 py-2 text-sm text-accent-700"
            >
              {authError}
            </div>
          )}

          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
