import { FileText } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Link } from 'react-router-dom';

export const EmptyState = ({ title, description, actionLabel, actionTo }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-6 py-16 text-center dark:border-gray-700">
    <div className="mb-4 rounded-full bg-primary-50 p-4 dark:bg-primary-900/30">
      <FileText className="h-8 w-8 text-primary-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>
    {actionLabel && actionTo && (
      <Link to={actionTo} className="mt-6">
        <Button>{actionLabel}</Button>
      </Link>
    )}
  </div>
);
