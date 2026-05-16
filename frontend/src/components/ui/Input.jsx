import { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = '', id, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
    )}
    <input
      ref={ref}
      id={id}
      className={`input-field ${error ? 'border-red-500' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));

Input.displayName = 'Input';
