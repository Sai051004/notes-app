import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { noteService } from '../services/note.service.js';
import { unwrapApiData } from '../utils/note.js';
import { Header } from '../components/layout/Header.jsx';
import { NoteForm } from '../components/forms/NoteForm.jsx';
import { toast } from 'react-toastify';

const CreateNotePage = () => {
  const { openSidebar } = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await noteService.create(data);
      const note = unwrapApiData(res);
      toast.success('Note created');
      navigate(`/notes/${note._id}/edit`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <Header title="Create Note" subtitle="Add a new note" onMenuClick={openSidebar} />
      <section className="flex-1 overflow-y-auto p-4 lg:p-8">
        <section className="card mx-auto max-w-3xl">
          <NoteForm onSubmit={handleSubmit} loading={loading} submitLabel="Create Note" />
        </section>
      </section>
    </section>
  );
};

export default CreateNotePage;
