import noteService from '../services/note.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';

export const getNotes = asyncHandler(async (req, res) => {
  const result = await noteService.getNotes(req.user._id, req.query);
  sendSuccess(res, result.notes, 'Notes retrieved', HTTP_STATUS.OK, result.meta);
});

export const getNoteById = asyncHandler(async (req, res) => {
  const note = await noteService.getNoteById(req.params.id, req.user._id);
  sendSuccess(res, note, 'Note retrieved');
});

export const createNote = asyncHandler(async (req, res) => {
  const note = await noteService.createNote(req.user._id, req.body);
  sendSuccess(res, note, 'Note created', HTTP_STATUS.CREATED);
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await noteService.updateNote(req.params.id, req.user._id, req.body);
  sendSuccess(res, note, 'Note updated');
});

export const deleteNote = asyncHandler(async (req, res) => {
  await noteService.deleteNote(req.params.id, req.user._id);
  sendSuccess(res, null, 'Note deleted');
});

export const shareNote = asyncHandler(async (req, res) => {
  const note = await noteService.shareNote(req.params.id, req.user._id, req.body);
  sendSuccess(res, note, 'Note shared successfully');
});

export const getVersionHistory = asyncHandler(async (req, res) => {
  const result = await noteService.getVersionHistory(req.params.id, req.user._id, req.query);
  sendSuccess(res, result.versions, 'Version history retrieved', HTTP_STATUS.OK, result.meta);
});

export const restoreVersion = asyncHandler(async (req, res) => {
  const note = await noteService.restoreVersion(
    req.params.id,
    req.params.versionId,
    req.user._id,
  );
  sendSuccess(res, note, 'Version restored successfully');
});

export const getSharedNotes = asyncHandler(async (req, res) => {
  const result = await noteService.getSharedNotes(req.user._id, req.query);
  sendSuccess(res, result.notes, 'Shared notes retrieved', HTTP_STATUS.OK, result.meta);
});

export const getSharedUnreadCount = asyncHandler(async (req, res) => {
  const result = await noteService.getSharedUnreadCount(req.user._id);
  sendSuccess(res, result, 'Unread shared notes count');
});

export const markSharedNotesAsRead = asyncHandler(async (req, res) => {
  const result = await noteService.markSharedNotesAsRead(req.user._id);
  sendSuccess(res, result, 'Shared notes marked as read');
});
