import authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  sendSuccess(res, result, 'Registration successful', HTTP_STATUS.CREATED);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  sendSuccess(res, result, 'Login successful');
});
