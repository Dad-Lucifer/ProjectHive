import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useRegister } from '../../hooks/useAuth';
import { extractError } from '../../api/client';
import { getErrorMessage } from '../../lib/errorCodes';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const mutation = useRegister();

  const onSubmit = async ({ name, email, password }: FormData) => {
    try {
      await mutation.mutateAsync({ name, email, password });
    } catch (err) {
      const { code, message } = extractError(err);
      const msg = getErrorMessage(code, message);
      if (code === 'EMAIL_ALREADY_EXISTS') {
        setError('email', { message: msg });
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
          <h1 className="font-display text-2xl font-medium text-ink mb-1">Create your account</h1>
          <p className="text-sm text-slate mb-8">Start building your academic record today.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input id="reg-name" label="Full Name" autoComplete="name" error={errors.name?.message} {...register('name')} />
            <Input id="reg-email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
            <Input id="reg-password" label="Password" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
            <Input id="reg-confirm" label="Confirm Password" type="password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

            {errors.root && <p className="text-xs text-rust">{errors.root.message}</p>}

            <Button type="submit" loading={mutation.isPending} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-sm text-slate mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-sky hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
