export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 50;

export const API_VERSION = 'v1';

export const ABOUT_INFO = {
  name: process.env.ABOUT_NAME || 'Saikiran Merugu',
  email: process.env.ABOUT_EMAIL || 'merugusaikiran05@gmail.com',
  'my features': {
    'Version History':
      'Every note update saves a snapshot so you can view history and restore any previous version.',
    'Full-Text Search':
      'Search across note titles and content using MongoDB text indexes for fast keyword lookup.',
    'Secure Note Sharing':
      'Share notes with other registered users by email so collaborators can read shared notes.',
  },
};
