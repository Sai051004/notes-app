import { useCallback, useEffect, useState } from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { noteService } from '../services/note.service.js';
import { Header } from '../components/layout/Header.jsx';
import { NoteCard } from '../components/notes/NoteCard.jsx';
import { NoteListSkeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { Pagination } from '../components/common/Pagination.jsx';
import { Button } from '../components/ui/Button.jsx';
import { toast } from 'react-toastify';
import { unwrapApiData } from '../utils/note.js';

const DashboardPage = () => {
  const { openSidebar } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const archived = searchParams.get('archived') === 'true';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const tag = searchParams.get('tag') || '';

  const [notes, setNotes] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await noteService.getAll({
        page,
        limit: 12,
        archived,
        tag: tag || undefined,
      });
      const payload = unwrapApiData(response);
      setNotes(Array.isArray(payload) ? payload : payload.data || []);
      setMeta(Array.isArray(payload) ? null : payload.meta || null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, archived, tag]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <Header
        title={archived ? 'Archived Notes' : 'My Notes'}
        subtitle={`${meta?.total ?? 0} notes`}
        onMenuClick={openSidebar}
        actions={
          <Link to="/notes/new">
            <Button>
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </Link>
        }
      />

      <section className="flex-1 overflow-y-auto p-4 lg:p-8">
        {loading && <NoteListSkeleton count={6} square />}
        {error && !loading && <ErrorState message={error} onRetry={fetchNotes} />}
        {!loading && !error && notes.length === 0 && (
          <EmptyState
            title={archived ? 'No archived notes' : 'No notes yet'}
            description="Create your first note to get started"
            actionLabel="Create Note"
            actionTo="/notes/new"
          />
        )}
        {!loading && !error && notes.length > 0 && (
          <>
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} square />
              ))}
            </section>
            <section className="mt-8">
              <Pagination meta={meta} onPageChange={handlePageChange} />
            </section>
          </>
        )}
      </section>
    </section>
  );
};

export default DashboardPage;
