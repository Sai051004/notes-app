export const formatNote = (note) => {
  if (!note) return null;

  const formatted = {
    id: note._id?.toString() || note.id,
    title: note.title,
    content: note.content ?? '',
    created_at: note.createdAt || note.created_at,
    updated_at: note.updatedAt || note.updated_at,
  };

  if (note.tags) formatted.tags = note.tags;
  if (note.isArchived !== undefined) formatted.isArchived = note.isArchived;
  if (note.sharedWith) formatted.sharedWith = note.sharedWith;

  return formatted;
};

export const formatNotes = (notes) => (notes || []).map(formatNote);
