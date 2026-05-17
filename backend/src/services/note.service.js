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

  async getOwnedNotes(userId, query = {}) {
    const uid = toUserId(userId);
    const { page, limit, skip } = parsePagination(query);
    const { sort, order } = query;

    return noteRepository.findAllOwnedByUser(uid, { skip, limit, sort, order });
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

    const note = await noteRepository.update(noteId, {
      ...data,
      $inc: { versionCount: 1 },
    });

    await this.#createVersion(note, uid, 'update');

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

  async getSharedNotes(userId, query) {
    const uid = toUserId(userId);
    const { page, limit, skip } = parsePagination(query);
    const { notes, total } = await noteRepository.findSharedWithUser(uid, { skip, limit });

    return {
      notes,
      meta: buildPaginationMeta(total, page, limit),
    };
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
