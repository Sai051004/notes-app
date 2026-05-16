import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';

export const ShareNoteForm = ({ onSubmit, loading }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: { share_with_email: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="share_with_email"
        label="Email address"
        type="email"
        placeholder="colleague@example.com"
        {...register('share_with_email', { required: true })}
      />
      <Button type="submit" loading={loading}>
        Share Note
      </Button>
    </form>
  );
};
