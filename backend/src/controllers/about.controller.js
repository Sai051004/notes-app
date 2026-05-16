import { asyncHandler } from '../utils/asyncHandler.js';
import { ABOUT_INFO } from '../constants/index.js';

export const getAbout = asyncHandler(async (_req, res) => {
  res.json(ABOUT_INFO);
});
