import Note from '../models/Note.js';

const notePopulate = { path: 'owner', select: 'email' };

class NoteRepository {
  async create(data) {
    const note = await Note.create(data);
    return Note.findById(note._id).populate(notePopulate).lean();
  }

  async findById(id) {
    return Note.findById(id).populate(notePopulate).lean();
  }

  async findByIdForUser(id, userId) {
    return Note.findOne({
      _id: id,
      $or: [{ owner: userId }, { 'sharedWith.user': userId }],
    })
      .populate(notePopulate)
      .populate('sharedWith.user', 'email')
      .lean();
  }

  async findAllOwnedByUser(userId, { skip, limit, sort = 'updatedAt', order = 'desc', archived, tag }) {
    const filter = { owner: userId };

    if (archived !== undefined) filter.isArchived = archived;
    if (tag) filter.tags = tag;

    const sortField = { [sort]: order === 'asc' ? 1 : -1 };

    return Note.find(filter).sort(sortField).skip(skip).limit(limit).lean();
  }

  async findAllForUser(userId, { skip, limit, archived, tag, sort, order }) {
    const filter = {
      $or: [{ owner: userId }, { 'sharedWith.user': userId }],
    };

    if (archived !== undefined) filter.isArchived = archived;
    if (tag) filter.tags = tag;

    const sortField = { [sort]: order === 'asc' ? 1 : -1 };

    const [notes, total] = await Promise.all([
      Note.find(filter)
        .populate(notePopulate)
        .sort(sortField)
        .skip(skip)
        .limit(limit)
        .lean(),
      Note.countDocuments(filter),
    ]);

    return { notes, total };
  }

  async findSharedWithUser(userId, { skip, limit }) {
    const filter = {
      'sharedWith.user': userId,
      owner: { $ne: userId },
    };

    const [notes, total] = await Promise.all([
      Note.find(filter)
        .populate(notePopulate)
        .populate('sharedWith.user', 'email')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Note.countDocuments(filter),
    ]);

    return { notes, total };
  }

  async countUnreadSharedWithUser(userId) {
    return Note.countDocuments({
      owner: { $ne: userId },
      sharedWith: {
        $elemMatch: {
          user: userId,
          $or: [{ readAt: { $exists: false } }, { readAt: null }],
        },
      },
    });
  }

  async markSharedAsReadForUser(userId) {
    const now = new Date();
    await Note.updateMany(
      { owner: { $ne: userId }, 'sharedWith.user': userId },
      { $set: { 'sharedWith.$[share].readAt': now } },
      {
        arrayFilters: [
          {
            'share.user': userId,
            $or: [{ 'share.readAt': { $exists: false } }, { 'share.readAt': null }],
          },
        ],
      },
    );
  }

  async update(id, data) {
    const { $inc, ...fields } = data;
    const updatePayload = { ...fields };
    if ($inc) updatePayload.$inc = $inc;

    return Note.findByIdAndUpdate(id, updatePayload, { new: true, runValidators: true })
      .populate(notePopulate)
      .lean();
  }

  async delete(id) {
    return Note.findByIdAndDelete(id).lean();
  }

  async search(userId, keyword, { skip, limit }) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const filter = {
      $and: [
        { $or: [{ owner: userId }, { 'sharedWith.user': userId }] },
        {
          $or: [
            { title: { $regex: escaped, $options: 'i' } },
            { content: { $regex: escaped, $options: 'i' } },
          ],
        },
      ],
    };

    const [notes, total] = await Promise.all([
      Note.find(filter).populate(notePopulate).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
      Note.countDocuments(filter),
    ]);

    return { notes, total };
  }

  async addShare(noteId, shareEntry) {
    return Note.findByIdAndUpdate(
      noteId,
      { $push: { sharedWith: shareEntry } },
      { new: true },
    )
      .populate(notePopulate)
      .populate('sharedWith.user', 'email')
      .lean();
  }

  async updateSharePermission(noteId, userId, permission) {
    return Note.findOneAndUpdate(
      { _id: noteId, 'sharedWith.user': userId },
      { $set: { 'sharedWith.$.permission': permission } },
      { new: true },
    )
      .populate(notePopulate)
      .populate('sharedWith.user', 'email')
      .lean();
  }
}

export default new NoteRepository();
