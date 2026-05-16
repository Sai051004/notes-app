import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, _res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized. Please log in.', HTTP_STATUS.UNAUTHORIZED);
  }

  const decoded = jwt.verify(token, config.jwt.secret);
  const user = await User.findById(decoded.id).lean();

  if (!user) {
    throw new AppError('User no longer exists.', HTTP_STATUS.UNAUTHORIZED);
  }

  req.user = user;
  next();
});

export const generateToken = (userId) =>
  jwt.sign({ id: userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
