export const validateNote = ({ title, content }) => {
  const errors = {};
  if (!title?.trim()) errors.title = 'Title is required';
  if (title && title.length > 200) errors.title = 'Title must be under 200 characters';
  if (content && content.length > 50000) errors.content = 'Content is too long';
  return errors;
};
