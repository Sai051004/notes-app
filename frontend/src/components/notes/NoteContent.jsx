/** Renders note body text with newlines and spacing preserved (plain text, not HTML). */
export const NoteContent = ({ content, className = '', emptyLabel = 'No content' }) => (
  <p className={`whitespace-pre-wrap break-words ${className}`}>{content || emptyLabel}</p>
);
