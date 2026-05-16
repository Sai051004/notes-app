import { describe, it, expect } from '@jest/globals';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';

describe('Pagination Utils', () => {
  describe('parsePagination', () => {
    it('should return default values', () => {
      const result = parsePagination({});
      expect(result).toEqual({ page: 1, limit: 10, skip: 0 });
    });

    it('should parse custom page and limit', () => {
      const result = parsePagination({ page: '2', limit: '20' });
      expect(result).toEqual({ page: 2, limit: 20, skip: 20 });
    });

    it('should cap limit at MAX_LIMIT', () => {
      const result = parsePagination({ limit: '100' });
      expect(result.limit).toBe(50);
    });
  });

  describe('buildPaginationMeta', () => {
    it('should build correct meta', () => {
      const meta = buildPaginationMeta(25, 2, 10);
      expect(meta).toEqual({
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: true,
      });
    });
  });
});
