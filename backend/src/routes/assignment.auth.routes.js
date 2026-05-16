import { Router } from 'express';
import * as authController from '../controllers/assignment.auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);

export default router;
