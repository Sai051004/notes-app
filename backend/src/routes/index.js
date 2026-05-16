import { Router } from 'express';
import authRoutes from './auth.routes.js';
import noteRoutes from './note.routes.js';
import searchRoutes from './search.routes.js';
import { getAbout } from '../controllers/about.controller.js';
import { API_VERSION } from '../constants/index.js';

const router = Router();

router.get('/about', getAbout);
router.use(`/auth`, authRoutes);
router.use(`/notes`, noteRoutes);
router.use(`/search`, searchRoutes);

export { router, API_VERSION };
