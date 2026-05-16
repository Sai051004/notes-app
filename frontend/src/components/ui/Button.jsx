export const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  loading = false,
  disabled,
  ...props
}) => {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return (
    <button
      type={type}
      className={`${base} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};
