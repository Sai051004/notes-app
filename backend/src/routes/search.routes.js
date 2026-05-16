import { Router } from 'express';
import * as searchController from '../controllers/search.controller.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { searchQuerySchema } from '../validators/note.validator.js';

const router = Router();

router.use(protect);
router.get('/', validate(searchQuerySchema, 'query'), searchController.searchNotes);

export default router;
