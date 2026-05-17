import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { RotateCcw, Clock, ChevronDown } from 'lucide-react';
import { noteService } from '../services/note.service.js';
import { Header } from '../components/layout/Header.jsx';
import { NoteListSkeleton } from '../components/ui/Skeleton.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Pagination } from '../components/common/Pagination.jsx';
import { Button } from '../components/ui/Button.jsx';
import { DiffField } from '../components/notes/DiffHighlight.jsx';
import { formatDate } from '../utils/formatDate.js';
import { hasDiffChanges, diffText } from '../utils/diffText.js';
import { toast } from 'react-toastify';

const getPreviousVersion = (version, allVersions) => {
  if (version.versionNumber <= 1) {
    return { title: '', content: '', loaded: true };
  }
  const prev = allVersions.find((v) => v.versionNumber === version.versionNumber - 1);
  if (prev) return { ...prev, loaded: true };
  return { title: '', content: '', loaded: false };
};

const versionHasChanges = (version, allVersions) => {
  const previous = getPreviousVersion(version, allVersions);
  if (!previous.loaded) return true;
  return (
    hasDiffChanges(diffText(previous.title, version.title)) ||
    hasDiffChanges(diffText(previous.content, version.content))
  );
};

const NoteHistoryPage = () => {
  const { id } = useParams();
  const { openSidebar } = useOutletContext();
  const navigate = useNavigate();
  const [versions, setVersions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(null);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await noteService.getHistory(id, { page, limit: 10 });
      setVersions(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const sortedVersions = useMemo(
    () => [...versions].sort((a, b) => b.versionNumber - a.versionNumber),
    [versions],
  );

  const handleRestore = async (e, versionId) => {
    e.stopPropagation();
    if (!window.confirm('Restore this version? Current content will be saved to history.')) return;
    setRestoring(versionId);
    try {
      await noteService.restoreVersion(id, versionId);
      toast.success('Version restored');
      navigate(`/notes/${id}/edit`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRestoring(null);
    }
  };

  const toggleVersion = (versionId) => {
    setSelectedId((current) => (current === versionId ? null : versionId));
  };

  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <Header title="Version History" subtitle="Audit trail of all changes" onMenuClick={openSidebar} />
      <section className="flex-1 overflow-y-auto p-4 lg:p-8">
        {loading && <NoteListSkeleton count={3} />}
        {error && <ErrorState message={error} onRetry={fetchHistory} />}
        {!loading && !error && versions.length === 0 && (
          <EmptyState title="No history" description="Version history will appear after edits" />
        )}
        {!loading && !error && versions.length > 0 && (
          <section className="mx-auto w-full max-w-5xl space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click a version to see what changed compared to the previous one.{' '}
              <span className="text-emerald-700 dark:text-emerald-400">Green</span> = added,{' '}
              <span className="text-red-700 line-through dark:text-red-400">red</span> = removed.
            </p>

            {sortedVersions.map((version) => {
              const isSelected = selectedId === version._id;
              const previous = getPreviousVersion(version, versions);
              const prevLabel =
                version.versionNumber > 1 ? `v${version.versionNumber - 1}` : 'empty';
              const changed = versionHasChanges(version, versions);
              const previousLoaded = previous.loaded;

              return (
                <article
                  key={version._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleVersion(version._id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleVersion(version._id);
                    }
                  }}
                  className={`card min-h-[240px] cursor-pointer p-8 transition ring-primary-500 hover:border-primary-300 dark:hover:border-primary-700 ${
                    isSelected ? 'border-primary-400 ring-2 ring-primary-500/30' : ''
                  }`}
                >
                  <header className="flex items-start justify-between gap-4">
                    <section className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary-600">
                        v{version.versionNumber} · {version.changeType}
                        <ChevronDown
                          className={`h-4 w-4 transition ${isSelected ? 'rotate-180' : ''}`}
                        />
                      </p>
                      <h3 className="mt-2 text-lg font-semibold">{version.title}</h3>
                      {!isSelected && (
                        <p className="mt-3 line-clamp-4 text-base leading-relaxed text-gray-500 dark:text-gray-400">
                          {version.content}
                        </p>
                      )}
                    </section>
                    <Button
                      variant="secondary"
                      loading={restoring === version._id}
                      onClick={(e) => handleRestore(e, version._id)}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restore
                    </Button>
                  </header>

                  {isSelected && (
                    <section className="mt-6 space-y-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Compared to {prevLabel}
                        {!previousLoaded &&
                          ' · load earlier pages to compare with the full previous version'}
                        {previousLoaded &&
                          !changed &&
                          ' · same title/content as previous (check tags/archive on the note)'}
                      </p>
                      {previousLoaded ? (
                        <>
                          <DiffField label="Title" oldText={previous.title} newText={version.title} />
                          <DiffField
                            label="Content"
                            oldText={previous.content}
                            newText={version.content}
                          />
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Showing this version only. Go to the next page of history to load v
                          {version.versionNumber - 1} for a full comparison.
                        </p>
                      )}
                    </section>
                  )}

                  <footer className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(version.createdAt)} by {version.updatedBy?.email || 'Unknown'}
                  </footer>
                </article>
              );
            })}
            <Pagination meta={meta} onPageChange={setPage} />
          </section>
        )}
      </section>
    </section>
  );
};

export default NoteHistoryPage;
