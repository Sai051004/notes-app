import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Page {meta.page} of {meta.totalPages} ({meta.total} notes)
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          disabled={!meta.hasPrevPage}
          onClick={() => onPageChange(meta.page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="secondary"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
