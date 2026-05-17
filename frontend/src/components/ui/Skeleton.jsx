export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 ${className}`} />
);

export const NoteCardSkeleton = ({ square = false }) => (
  <div className={`card space-y-3 ${square ? 'aspect-square min-h-[300px] w-full' : ''}`}>
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  </div>
);

export const NoteListSkeleton = ({ count = 6, square = false }) => (
  <div className={`grid ${square ? 'grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3' : 'gap-4 sm:grid-cols-2 lg:grid-cols-3'}`}>
    {Array.from({ length: count }).map((_, i) => (
      <NoteCardSkeleton key={i} square={square} />
    ))}
  </div>
);
