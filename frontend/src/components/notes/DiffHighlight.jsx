import { diffText, hasDiffChanges } from '../../utils/diffText.js';

const segmentClass = {
  equal: 'text-gray-700 dark:text-gray-300',
  add: 'rounded-sm bg-emerald-200/80 px-0.5 text-emerald-950 dark:bg-emerald-500/35 dark:text-emerald-50',
  remove:
    'rounded-sm bg-red-200/70 px-0.5 text-red-900 line-through decoration-red-600/80 dark:bg-red-500/30 dark:text-red-100',
};

export const DiffHighlight = ({ oldText = '', newText = '', className = '' }) => {
  const segments = diffText(oldText, newText);

  if (!hasDiffChanges(segments)) {
    return (
      <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
        No title or content changes compared to the previous version (tags or archive may have
        changed).
      </p>
    );
  }

  return (
    <p className={`whitespace-pre-wrap text-sm leading-relaxed ${className}`}>
      {segments.map((segment, index) => (
        <span key={`${segment.type}-${index}`} className={segmentClass[segment.type]}>
          {segment.value}
        </span>
      ))}
    </p>
  );
};

export const DiffField = ({ label, oldText, newText }) => (
  <section className="min-h-[100px] space-y-3">
    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {label}
    </h4>
    <DiffHighlight oldText={oldText} newText={newText} className="text-base" />
  </section>
);
