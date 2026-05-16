import User from '../models/User.js';

class UserRepository {
  async create(data) {
    return User.create(data);
  }

  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) query.select('+password');
    return query.lean();
  }

  async findById(id) {
    return User.findById(id).lean();
  }

  async findByEmailWithPassword(email) {
    return User.findOne({ email: email.toLowerCase() }).select('+password');
  }
}

export default new UserRepository();
