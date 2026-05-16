import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from '../constants/index.js';

export const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || DEFAULT_PAGE);
  let limit = parseInt(query.limit, 10) || DEFAULT_LIMIT;
  limit = Math.min(Math.max(1, limit), MAX_LIMIT);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit) || 1,
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});
