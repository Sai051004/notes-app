import noteService from '../services/note.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const searchNotes = asyncHandler(async (req, res) => {
  const result = await noteService.searchNotes(req.user._id, req.query);
  sendSuccess(res, result.notes, 'Search results', 200, result.meta);
});
