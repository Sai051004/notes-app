import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { validateNote } from '../../validations/note.validation.js';

export const NoteForm = ({ defaultValues, onSubmit, loading, submitLabel = 'Save Note' }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      tags: '',
      isArchived: false,
      ...defaultValues,
    },
  });

  const handleFormSubmit = (data) => {
    const validationErrors = validateNote(data);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([key, message]) => setError(key, { message }));
      return;
    }

    const tags = data.tags
      ? data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    onSubmit({
      title: data.title.trim(),
      content: data.content || '',
      tags,
      ...(data.isArchived !== undefined && { isArchived: data.isArchived }),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        id="title"
        label="Title"
        placeholder="Note title"
        error={errors.title?.message}
        {...register('title', { required: 'Title is required' })}
      />

      <section className="space-y-1.5">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Content
        </label>
        <textarea
          id="content"
          rows={18}
          className="input-field min-h-[min(70vh,720px)] resize-y"
          placeholder="Write your note..."
          {...register('content')}
        />
        {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
      </section>

      <Input
        id="tags"
        label="Tags"
        placeholder="work, ideas, personal (comma separated)"
        {...register('tags')}
      />

      {defaultValues?.isArchived !== undefined && (
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" className="rounded border-gray-300" {...register('isArchived')} />
          Archive this note
        </label>
      )}

      <Button type="submit" loading={loading}>
        {submitLabel}
      </Button>
    </form>
  );
};
