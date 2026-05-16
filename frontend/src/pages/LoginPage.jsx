import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <section>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
      <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
          Register
        </Link>
      </p>
    </section>
  );
};

export default LoginPage;
