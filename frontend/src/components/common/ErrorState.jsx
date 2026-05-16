import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950/30">
    <AlertCircle className="mb-4 h-10 w-10 text-red-500" />
    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Something went wrong</h3>
    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{message}</p>
    {onRetry && (
      <Button variant="secondary" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);
