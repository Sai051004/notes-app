const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
};

export const config = {
  get nodeEnv() {
    return process.env.NODE_ENV || 'development';
  },
  get port() {
    return parseInt(process.env.PORT, 10) || 5000;
  },
  get mongodbUri() {
    return process.env.MONGODB_URI;
  },
  get jwt() {
    return {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    };
  },
  get corsOrigin() {
    return process.env.CORS_ORIGIN || 'http://localhost:5173';
  },
  get corsOrigins() {
    const port = this.port;
    const defaults = [
      'http://localhost:5173',
      `http://localhost:${port}`,
      `http://127.0.0.1:${port}`,
    ];
    const fromEnv = (process.env.CORS_ORIGIN || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    return [...new Set([...fromEnv, ...defaults])];
  },
  get rateLimit() {
    return {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
      max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    };
  },
  get logLevel() {
    return process.env.LOG_LEVEL || 'info';
  },
  get isProduction() {
    return process.env.NODE_ENV === 'production';
  },
  get isTest() {
    return process.env.NODE_ENV === 'test';
  },
};
