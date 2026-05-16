import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({ email: data.email, password: data.password });
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
      <p className="mt-1 text-sm text-gray-500">Start organizing your notes</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input
          id="email"
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Minimum 8 characters' },
          })}
        />
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm password',
            validate: (val) => val === watch('password') || 'Passwords do not match',
          })}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </section>
  );
};

export default RegisterPage;
