import { Link } from 'react-router-dom';
import { Archive, Clock, History, Share2, Tag } from 'lucide-react';
import { formatRelative } from '../../utils/formatDate.js';
import { NoteContent } from './NoteContent.jsx';

export const NoteCard = ({ note, square = false }) => (
  <article
    className={`group card flex flex-col transition hover:border-primary-300 hover:shadow-md dark:hover:border-primary-700 ${
      square ? 'aspect-square min-h-[300px] w-full' : ''
    }`}
  >
    <Link
      to={`/notes/${note._id}/edit`}
      className={square ? 'flex min-h-0 flex-1 flex-col' : 'block'}
    >
      <header className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 font-semibold text-gray-900 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
          {note.title}
        </h3>
        <span className="flex shrink-0 items-center gap-1">
          {note.isUnread && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              New
            </span>
          )}
          {note.isArchived && <Archive className="h-4 w-4 text-amber-500" />}
        </span>
      </header>
      {note.sharedBy && (
        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400">
          <Share2 className="h-3 w-3 shrink-0" />
          Shared by {note.sharedBy}
        </p>
      )}
      <NoteContent
        content={note.content}
        className={`mt-2 text-sm text-gray-500 dark:text-gray-400 ${
          square ? 'line-clamp-5 flex-1' : 'line-clamp-2'
        }`}
      />
      {note.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      )}
      <footer className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatRelative(note.updatedAt)}
        </span>
      </footer>
    </Link>
    <Link
      to={`/notes/${note._id}/history`}
      className="mt-2 flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400"
    >
      <History className="h-3.5 w-3.5" />
      Version history
    </Link>
  </article>
);
