import userRepository from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/index.js';
import { generateToken } from '../middlewares/auth.js';
import User from '../models/User.js';

class AuthService {
  async register({ email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('Email already registered', HTTP_STATUS.CONFLICT);
    }

    const user = await User.create({ email, password });
    const token = generateToken(user._id);

    return {
      user: { id: user._id, email: user.email },
      token,
    };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }

    const token = generateToken(user._id);

    return {
      user: { id: user._id, email: user.email },
      token,
    };
  }
}

export default new AuthService();
