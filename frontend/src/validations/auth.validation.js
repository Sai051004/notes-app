export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Invalid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return '';
};
