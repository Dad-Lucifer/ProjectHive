import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useLogin } from '../../hooks/useAuth';
import { extractError } from '../../api/client';
import { getErrorMessage } from '../../lib/errorCodes';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const mutation = useLogin();

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync(data);
    } catch (err) {
      const { code, message } = extractError(err);
      const msg = getErrorMessage(code, message);
      if (code === 'INVALID_CREDENTIALS') {
        setError('password', { message: msg });
      } else {
        setError('root', { message: msg });
      }
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <nav className="border-b border-line px-6 h-14 flex items-center">
        <Link to="/" className="font-display text-lg font-semibold text-ink">ProjectHive</Link>
      </nav>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-medium text-ink mb-1">Welcome back</h1>
          <p className="text-sm text-slate mb-8">Sign in to your ProjectHive account.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              id="login-email"
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              id="login-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {errors.root && (
              <p className="text-xs text-rust">{errors.root.message}</p>
            )}

            <Button type="submit" loading={mutation.isPending} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <p className="text-sm text-slate mt-6 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
