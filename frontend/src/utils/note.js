export const normalizeNote = (note) => {
  if (!note) return note;

  const id = note.id || note._id;

  return {
    ...note,
    _id: id,
    id,
    createdAt: note.created_at || note.createdAt,
    updatedAt: note.updated_at || note.updatedAt,
    created_at: note.created_at || note.createdAt,
    updated_at: note.updated_at || note.updatedAt,
    sharedBy: note.sharedBy ?? note.owner?.email,
    sharedAt: note.sharedAt,
    isUnread: note.isUnread,
  };
};

export const normalizeNotes = (notes) => (Array.isArray(notes) ? notes.map(normalizeNote) : []);

export const unwrapApiData = (response) => {
  const payload = response.data;

  if (Array.isArray(payload)) {
    return normalizeNotes(payload);
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    if (Array.isArray(payload.data)) {
      return { ...payload, data: normalizeNotes(payload.data) };
    }
    return { ...payload, data: normalizeNote(payload.data) };
  }

  return normalizeNote(payload);
};
