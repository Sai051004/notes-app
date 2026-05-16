import { Router } from 'express';
import * as noteController from '../controllers/note.controller.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createNoteSchema,
  updateNoteSchema,
  shareNoteSchema,
  noteQuerySchema,
} from '../validators/note.validator.js';

const router = Router();

router.use(protect);

router.get('/shared', validate(noteQuerySchema, 'query'), noteController.getSharedNotes);
router.get('/', validate(noteQuerySchema, 'query'), noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.get('/:id/history', validate(noteQuerySchema, 'query'), noteController.getVersionHistory);
router.post('/', validate(createNoteSchema), noteController.createNote);
router.post('/:id/share', validate(shareNoteSchema), noteController.shareNote);
router.post('/:id/restore/:versionId', noteController.restoreVersion);
router.put('/:id', validate(updateNoteSchema), noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

export default router;
