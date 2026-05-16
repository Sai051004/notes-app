import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-minimum-32-characters-long';
process.env.JWT_EXPIRES_IN = '1h';
