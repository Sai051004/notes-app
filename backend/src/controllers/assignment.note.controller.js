import noteService from '../services/note.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { formatNote, formatNotes } from '../utils/noteFormatter.js';
import { HTTP_STATUS, PERMISSIONS } from '../constants/index.js';

export const getNotes = asyncHandler(async (req, res) => {
  const notes = await noteService.getOwnedNotes(req.user._id, req.query);
  res.status(HTTP_STATUS.OK).json(formatNotes(notes));
});

export const getNoteById = asyncHandler(async (req, res) => {
  const note = await noteService.getNoteById(req.params.id, req.user._id);
  res.status(HTTP_STATUS.OK).json(formatNote(note));
});

export const createNote = asyncHandler(async (req, res) => {
  const note = await noteService.createNote(req.user._id, req.body);
  res.status(HTTP_STATUS.CREATED).json(formatNote(note));
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await noteService.updateNote(req.params.id, req.user._id, req.body);
  res.status(HTTP_STATUS.OK).json(formatNote(note));
});

export const deleteNote = asyncHandler(async (req, res) => {
  await noteService.deleteNote(req.params.id, req.user._id);
  res.status(HTTP_STATUS.NO_CONTENT).send();
});

export const shareNote = asyncHandler(async (req, res) => {
  await noteService.shareNote(req.params.id, req.user._id, {
    email: req.body.share_with_email,
    permission: PERMISSIONS.READ,
  });
  res.status(HTTP_STATUS.OK).json({ message: 'Note shared successfully' });
});
