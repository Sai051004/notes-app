import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { noteService } from '../services/note.service.js';
import { unwrapApiData } from '../utils/note.js';
import { Header } from '../components/layout/Header.jsx';
import { NoteCard } from '../components/notes/NoteCard.jsx';
import { NoteListSkeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { Pagination } from '../components/common/Pagination.jsx';

const SharedNotesPage = () => {
  const { openSidebar } = useOutletContext();
  const [notes, setNotes] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShared = useCallback(async () => {
    setLoading(true);
    try {
      const response = await noteService.getShared({ page, limit: 12 });
      const payload = unwrapApiData(response);
      setNotes(Array.isArray(payload) ? payload : payload.data || []);
      setMeta(Array.isArray(payload) ? null : payload.meta || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchShared();
  }, [fetchShared]);

  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <Header title="Shared Notes" subtitle="Notes shared with you" onMenuClick={openSidebar} />
      <section className="flex-1 overflow-y-auto p-4 lg:p-8">
        {loading && <NoteListSkeleton />}
        {error && <ErrorState message={error} onRetry={fetchShared} />}
        {!loading && !error && notes.length === 0 && (
          <EmptyState
            title="No shared notes"
            description="Notes shared with you will appear here"
          />
        )}
        {!loading && !error && notes.length > 0 && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </section>
            <Pagination meta={meta} onPageChange={setPage} />
          </>
        )}
      </section>
    </section>
  );
};

export default SharedNotesPage;
