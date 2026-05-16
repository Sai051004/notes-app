import NoteVersion from '../models/NoteVersion.js';

class NoteVersionRepository {
  async create(data) {
    return NoteVersion.create(data);
  }

  async findByNoteId(noteId, { skip, limit }) {
    const [versions, total] = await Promise.all([
      NoteVersion.find({ noteId })
        .populate('updatedBy', 'email')
        .sort({ versionNumber: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      NoteVersion.countDocuments({ noteId }),
    ]);
    return { versions, total };
  }

  async findById(versionId) {
    return NoteVersion.findById(versionId).lean();
  }

  async getLatestVersionNumber(noteId) {
    const latest = await NoteVersion.findOne({ noteId })
      .sort({ versionNumber: -1 })
      .select('versionNumber')
      .lean();
    return latest?.versionNumber || 0;
  }

  async deleteByNoteId(noteId) {
    return NoteVersion.deleteMany({ noteId });
  }
}

export default new NoteVersionRepository();
