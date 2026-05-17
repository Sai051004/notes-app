import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { noteService } from '../services/note.service.js';
import { unwrapApiData } from '../utils/note.js';
import { Header } from '../components/layout/Header.jsx';
import { NoteForm } from '../components/forms/NoteForm.jsx';
import { ShareNoteForm } from '../components/forms/ShareNoteForm.jsx';
import { NoteListSkeleton } from '../components/ui/Skeleton.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { Button } from '../components/ui/Button.jsx';
import { toast } from 'react-toastify';

const EditNotePage = () => {
  const { id } = useParams();
  const { openSidebar } = useOutletContext();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState(null);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await noteService.getById(id);
        setNote(unwrapApiData(response));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      const response = await noteService.update(id, formData);
      setNote(unwrapApiData(response));
      toast.success('Note saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async (data) => {
    setSharing(true);
    try {
      await noteService.share(id, data);
      toast.success('Note shared successfully');
      setShowShare(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSharing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this note permanently?')) return;
    try {
      await noteService.delete(id);
      toast.success('Note deleted');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <section className="p-8">
        <NoteListSkeleton count={1} />
      </section>
    );
  }

  if (error) return <ErrorState message={error} onRetry={() => navigate(0)} />;

  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Edit Note"
        subtitle={note?.title}
        onMenuClick={openSidebar}
        actions={
          <>
            <Button variant="secondary" onClick={() => setShowShare(!showShare)}>
              Share
            </Button>
            <Button variant="secondary" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </>
        }
      />
      <section className="flex-1 overflow-y-auto p-4 lg:p-6 xl:p-8">
        <section
          className={`mx-auto grid w-full max-w-6xl gap-6 ${
            showShare ? 'lg:grid-cols-[minmax(0,1fr)_320px]' : 'lg:grid-cols-1'
          }`}
        >
          <section className="card min-w-0">
            <NoteForm
              defaultValues={{
                title: note.title,
                content: note.content,
                tags: note.tags?.join(', ') || '',
                isArchived: note.isArchived,
              }}
              onSubmit={handleUpdate}
              loading={saving}
            />
          </section>
          {showShare && (
            <section className="card">
              <h3 className="mb-4 font-semibold">Share Note</h3>
              <ShareNoteForm onSubmit={handleShare} loading={sharing} />
              {note.sharedWith?.length > 0 && (
                <section className="mt-6 border-t pt-4 dark:border-gray-700">
                  <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Shared with
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    {note.sharedWith.map((s, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{s.user?.email || 'User'}</span>
                        <span className="capitalize text-primary-600">{s.permission}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </section>
          )}
        </section>
      </section>
    </section>
  );
};

export default EditNotePage;
