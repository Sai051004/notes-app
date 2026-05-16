import authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../constants/index.js';

export const register = asyncHandler(async (req, res) => {
  await authService.register(req.body);
  res.status(HTTP_STATUS.CREATED).json({ message: 'Registration successful' });
});

export const login = asyncHandler(async (req, res) => {
  const { token } = await authService.login(req.body);
  res.status(HTTP_STATUS.OK).json({ access_token: token });
});
