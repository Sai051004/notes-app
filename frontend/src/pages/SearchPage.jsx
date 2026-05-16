import { useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { noteService } from '../services/note.service.js';
import { unwrapApiData } from '../utils/note.js';
import { Header } from '../components/layout/Header.jsx';
import { NoteCard } from '../components/notes/NoteCard.jsx';
import { NoteListSkeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Pagination } from '../components/common/Pagination.jsx';
import { Button } from '../components/ui/Button.jsx';

const SearchPage = () => {
  const { openSidebar } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [notes, setNotes] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);

  const handleSearch = async (e, newPage = 1) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const response = await noteService.search({ q: query.trim(), page: newPage, limit: 12 });
      const payload = unwrapApiData(response);
      setNotes(Array.isArray(payload) ? payload : payload.data || []);
      setMeta(Array.isArray(payload) ? null : payload.meta || null);
      setPage(newPage);
      setSearchParams({ q: query.trim() });
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <Header title="Search" subtitle="Full-text search across your notes" onMenuClick={openSidebar} />
      <section className="flex-1 overflow-y-auto p-4 lg:p-8">
        <form onSubmit={handleSearch} className="mb-8 flex gap-3">
          <section className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes..."
              className="input-field pl-10"
            />
          </section>
          <Button type="submit" loading={loading}>
            Search
          </Button>
        </form>

        {loading && <NoteListSkeleton />}
        {searched && !loading && notes.length === 0 && (
          <EmptyState title="No results" description={`No notes found for "${query}"`} />
        )}
        {!loading && notes.length > 0 && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </section>
            <Pagination meta={meta} onPageChange={(p) => handleSearch(null, p)} />
          </>
        )}
      </section>
    </section>
  );
};

export default SearchPage;
