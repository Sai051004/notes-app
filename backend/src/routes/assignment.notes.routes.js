import { Router } from 'express';
import * as noteController from '../controllers/assignment.note.controller.js';
import * as extendedNoteController from '../controllers/note.controller.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  assignmentCreateNoteSchema,
  assignmentUpdateNoteSchema,
  shareNoteSchema,
  noteQuerySchema,
} from '../validators/note.validator.js';

const router = Router();

router.use(protect);

router.get('/shared/unread-count', extendedNoteController.getSharedUnreadCount);
router.post('/shared/mark-read', extendedNoteController.markSharedNotesAsRead);
router.get('/shared', validate(noteQuerySchema, 'query'), extendedNoteController.getSharedNotes);
router.get('/', validate(noteQuerySchema, 'query'), noteController.getNotes);
router.post('/', validate(assignmentCreateNoteSchema), noteController.createNote);
router.get('/:id/history', validate(noteQuerySchema, 'query'), extendedNoteController.getVersionHistory);
router.post('/:id/restore/:versionId', extendedNoteController.restoreVersion);
router.get('/:id', noteController.getNoteById);
router.put('/:id', validate(assignmentUpdateNoteSchema), noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.post('/:id/share', validate(shareNoteSchema), noteController.shareNote);

export default router;
