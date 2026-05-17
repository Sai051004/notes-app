import noteRepository from '../repositories/note.repository.js';
import noteVersionRepository from '../repositories/noteVersion.repository.js';
import userRepository from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS, PERMISSIONS } from '../constants/index.js';
import { parsePagination, buildPaginationMeta } from '../utils/pagination.js';

const toUserId = (userId) => userId?.toString?.() ?? userId;

class NoteService {
  #checkAccess(note, userId, requiredPermission = PERMISSIONS.READ) {
    const uid = toUserId(userId);
    const isOwner =
      toUserId(note.owner._id) === uid ||
      toUserId(note.owner) === uid;

    if (isOwner) return true;

    const share = note.sharedWith?.find(
      (s) => toUserId(s.user._id) === uid || toUserId(s.user) === uid,
    );

    if (!share) return false;
    if (requiredPermission === PERMISSIONS.WRITE) {
      return share.permission === PERMISSIONS.WRITE;
    }
    return true;
  }

  async #createVersion(note, userId, changeType = 'update') {
    const versionNumber = (await noteVersionRepository.getLatestVersionNumber(note._id)) + 1;

    await noteVersionRepository.create({
      noteId: note._id,
      title: note.title,
      content: note.content,
      versionNumber,
      updatedBy: userId,
      changeType,
    });

    return versionNumber;
  }

  #normalizeTags(tags) {
    return [...(tags || [])].map((t) => String(t).trim()).filter(Boolean).sort();
  }

  #tagsEqual(a, b) {
    const left = this.#normalizeTags(a);
    const right = this.#normalizeTags(b);
    return left.length === right.length && left.every((tag, i) => tag === right[i]);
  }

  #contentFieldsChanged(existing, data) {
    if (data.title !== undefined && data.title !== existing.title) return true;
    if (data.content !== undefined && (data.content ?? '') !== (existing.content ?? '')) return true;
    if (data.tags !== undefined && !this.#tagsEqual(data.tags, existing.tags)) return true;
    return false;
  }

  #archiveChanged(existing, data) {
    if (data.isArchived === undefined) return false;
    return Boolean(data.isArchived) !== Boolean(existing.isArchived);
  }

  #hasAnyFieldChange(existing, data) {
    return this.#contentFieldsChanged(existing, data) || this.#archiveChanged(existing, data);
  }

  async getOwnedNotes(userId, query = {}) {
    const uid = toUserId(userId);
    const { page, limit, skip } = parsePagination(query);
    const { archived, tag, sort, order } = query;

    return noteRepository.findAllOwnedByUser(uid, {
      skip,
      limit,
      sort,
      order,
      archived: archived !== undefined ? archived : false,
      tag,
    });
  }

  async getNotes(userId, query) {
    const { page, limit, skip } = parsePagination(query);
    const { archived, tag, sort, order } = query;

    const { notes, total } = await noteRepository.findAllForUser(toUserId(userId), {
      skip,
      limit,
      archived: archived !== undefined ? archived : false,
      tag,
      sort,
      order,
    });

    return {
      notes,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getNoteById(noteId, userId) {
    const note = await noteRepository.findByIdForUser(noteId, toUserId(userId));
    if (!note) throw new AppError('Note not found', HTTP_STATUS.NOT_FOUND);
    return note;
  }

  async createNote(userId, data) {
    const uid = toUserId(userId);
    const note = await noteRepository.create({
      ...data,
      owner: uid,
    });

    await noteVersionRepository.create({
      noteId: note._id,
      title: note.title,
      content: note.content,
      versionNumber: 1,
      updatedBy: uid,
      changeType: 'create',
    });

    return note;
  }

  async updateNote(noteId, userId, data) {
    const uid = toUserId(userId);
    const existing = await noteRepository.findByIdForUser(noteId, uid);
    if (!existing) throw new AppError('Note not found', HTTP_STATUS.NOT_FOUND);

    const isOwner =
      toUserId(existing.owner._id) === uid || toUserId(existing.owner) === uid;
    const share = existing.sharedWith?.find(
      (s) => toUserId(s.user._id) === uid || toUserId(s.user) === uid,
    );

    if (!isOwner && (!share || share.permission !== PERMISSIONS.WRITE)) {
      throw new AppError('You do not have permission to edit this note', HTTP_STATUS.FORBIDDEN);
    }

    if (!this.#hasAnyFieldChange(existing, data)) {
      return existing;
    }

    const versionWorthy = this.#contentFieldsChanged(existing, data);
    const updatePayload = { ...data };

    if (versionWorthy) {
      updatePayload.$inc = { versionCount: 1 };
    }

    const note = await noteRepository.update(noteId, updatePayload);

    if (versionWorthy) {
      await this.#createVersion(note, uid, 'update');
    }

    return note;
  }

  async deleteNote(noteId, userId) {
    const uid = toUserId(userId);
    const note = await noteRepository.findByIdForUser(noteId, uid);
    if (!note) throw new AppError('Note not found', HTTP_STATUS.NOT_FOUND);

    const isOwner = toUserId(note.owner._id) === uid || toUserId(note.owner) === uid;
    if (!isOwner) {
      throw new AppError('Only the owner can delete this note', HTTP_STATUS.FORBIDDEN);
    }

    await noteVersionRepository.deleteByNoteId(noteId);
    await noteRepository.delete(noteId);
  }

  async shareNote(noteId, userId, { email, permission }) {
    const uid = toUserId(userId);
    const note = await noteRepository.findById(noteId);
    if (!note) throw new AppError('Note not found', HTTP_STATUS.NOT_FOUND);

    if (toUserId(note.owner._id) !== uid && toUserId(note.owner) !== uid) {
      throw new AppError('Only the owner can share this note', HTTP_STATUS.FORBIDDEN);
    }

    const targetUser = await userRepository.findByEmail(email);
    if (!targetUser) throw new AppError('User not found with that email', HTTP_STATUS.NOT_FOUND);

    if (toUserId(targetUser._id) === uid) {
      throw new AppError('Cannot share note with yourself', HTTP_STATUS.BAD_REQUEST);
    }

    const existingShare = note.sharedWith?.find(
      (s) => s.user.toString() === targetUser._id.toString(),
    );

    if (existingShare) {
      return noteRepository.updateSharePermission(noteId, targetUser._id, permission);
    }

    return noteRepository.addShare(noteId, {
      user: targetUser._id,
      permission,
      sharedAt: new Date(),
      readAt: null,
    });
  }

  async searchNotes(userId, query) {
    const uid = toUserId(userId);
    const { page, limit, skip } = parsePagination(query);
    const { notes, total } = await noteRepository.search(uid, query.q, { skip, limit });

    return {
      notes,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  #getShareForUser(note, userId) {
    const uid = toUserId(userId);
    return note.sharedWith?.find(
      (entry) =>
        toUserId(entry.user?._id) === uid ||
        toUserId(entry.user) === uid,
    );
  }

  #enrichSharedNote(note, userId) {
    const share = this.#getShareForUser(note, userId);
    return {
      ...note,
      sharedBy: note.owner?.email || null,
      sharedAt: share?.sharedAt || null,
      isUnread: !share?.readAt,
    };
  }

  async getSharedNotes(userId, query) {
    const uid = toUserId(userId);
    const { page, limit, skip } = parsePagination(query);
    const { notes, total } = await noteRepository.findSharedWithUser(uid, { skip, limit });

    return {
      notes: notes.map((note) => this.#enrichSharedNote(note, uid)),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getSharedUnreadCount(userId) {
    const count = await noteRepository.countUnreadSharedWithUser(toUserId(userId));
    return { count };
  }

  async markSharedNotesAsRead(userId) {
    await noteRepository.markSharedAsReadForUser(toUserId(userId));
    return { count: 0 };
  }

  async getVersionHistory(noteId, userId, query) {
    const uid = toUserId(userId);
    const note = await noteRepository.findByIdForUser(noteId, uid);
    if (!note) throw new AppError('Note not found', HTTP_STATUS.NOT_FOUND);

    const { page, limit, skip } = parsePagination(query);
    const { versions, total } = await noteVersionRepository.findByNoteId(noteId, {
      skip,
      limit,
    });

    return {
      versions,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async restoreVersion(noteId, versionId, userId) {
    const uid = toUserId(userId);
    const note = await noteRepository.findByIdForUser(noteId, uid);
    if (!note) throw new AppError('Note not found', HTTP_STATUS.NOT_FOUND);

    const isOwner = toUserId(note.owner._id) === uid || toUserId(note.owner) === uid;
    const share = note.sharedWith?.find(
      (s) => toUserId(s.user._id) === uid || toUserId(s.user) === uid,
    );

    if (!isOwner && (!share || share.permission !== PERMISSIONS.WRITE)) {
      throw new AppError('You do not have permission to restore this note', HTTP_STATUS.FORBIDDEN);
    }

    const version = await noteVersionRepository.findById(versionId);
    if (!version || version.noteId.toString() !== noteId) {
      throw new AppError('Version not found', HTTP_STATUS.NOT_FOUND);
    }

    const alreadyAtVersion =
      note.title === version.title && (note.content ?? '') === (version.content ?? '');

    if (alreadyAtVersion) {
      return note;
    }

    const restored = await noteRepository.update(noteId, {
      title: version.title,
      content: version.content,
      $inc: { versionCount: 1 },
    });

    await noteVersionRepository.create({
      noteId,
      title: restored.title,
      content: restored.content,
      versionNumber: (await noteVersionRepository.getLatestVersionNumber(noteId)) + 1,
      updatedBy: uid,
      changeType: 'restore',
    });

    return restored;
  }
}

export default new NoteService();
