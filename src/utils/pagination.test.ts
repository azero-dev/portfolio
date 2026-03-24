import { describe, it, expect } from 'vitest';
import { paginate, filterByTag, sortByDate, type PaginationOptions } from './pagination';

const mockPosts = [
  { id: 1, data: { tags: ['React', 'TypeScript'], pubDate: '2024-03-01' } },
  { id: 2, data: { tags: ['Astro', 'CSS'], pubDate: '2024-02-15' } },
  { id: 3, data: { tags: ['React', 'Testing'], pubDate: '2024-03-10' } },
  { id: 4, data: { tags: ['JavaScript'], pubDate: '2024-01-20' } },
  { id: 5, data: { tags: ['React'], pubDate: '2024-03-05' } },
  { id: 6, data: { tags: ['TypeScript'], pubDate: '2024-02-01' } },
  { id: 7, data: { tags: ['Astro'], pubDate: '2024-01-10' } },
];

describe('pagination utilities', () => {
  describe('paginate', () => {
    it('should paginate items correctly', () => {
      const options: PaginationOptions = {
        currentPage: 1,
        baseUrl: '/blog',
        itemsPerPage: 3,
      };
      const result = paginate(mockPosts, options);

      expect(result.items).toHaveLength(3);
      expect(result.items[0].id).toBe(1);
      expect(result.items[1].id).toBe(2);
      expect(result.items[2].id).toBe(3);
      expect(result.totalItems).toBe(7);
      expect(result.totalPages).toBe(3); // 7 items / 3 per page = 3 pages
      expect(result.currentPage).toBe(1);
      expect(result.hasPrev).toBe(false);
      expect(result.hasNext).toBe(true);
      expect(result.prevUrl).toBeNull();
      expect(result.nextUrl).toBe('/blog/page/2');
    });

    it('should handle page 2', () => {
      const options: PaginationOptions = {
        currentPage: 2,
        baseUrl: '/blog',
        itemsPerPage: 3,
      };
      const result = paginate(mockPosts, options);

      expect(result.items).toHaveLength(3);
      expect(result.items[0].id).toBe(4);
      expect(result.items[1].id).toBe(5);
      expect(result.items[2].id).toBe(6);
      expect(result.currentPage).toBe(2);
      expect(result.hasPrev).toBe(true);
      expect(result.hasNext).toBe(true);
      expect(result.prevUrl).toBe('/blog');
      expect(result.nextUrl).toBe('/blog/page/3');
    });

    it('should handle last page with incomplete items', () => {
      const options: PaginationOptions = {
        currentPage: 3,
        baseUrl: '/blog',
        itemsPerPage: 3,
      };
      const result = paginate(mockPosts, options);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe(7);
      expect(result.currentPage).toBe(3);
      expect(result.hasPrev).toBe(true);
      expect(result.hasNext).toBe(false);
      expect(result.prevUrl).toBe('/blog/page/2');
      expect(result.nextUrl).toBeNull();
    });

    it('should adjust current page if out of range', () => {
      const options: PaginationOptions = {
        currentPage: 10,
        baseUrl: '/blog',
        itemsPerPage: 3,
      };
      const result = paginate(mockPosts, options);

      expect(result.currentPage).toBe(3); // Clamped to max page
      expect(result.items).toHaveLength(1);
    });

    it('should handle page 1 as base URL', () => {
      const options: PaginationOptions = {
        currentPage: 1,
        baseUrl: '/blog',
        itemsPerPage: 3,
      };
      const result = paginate(mockPosts, options);

      expect(result.prevUrl).toBeNull();
      expect(result.nextUrl).toBe('/blog/page/2');
    });

    it('should include tag in URLs when provided', () => {
      const options: PaginationOptions = {
        currentPage: 2,
        baseUrl: '/blog',
        itemsPerPage: 2,
        tag: 'React',
      };
      const result = paginate(mockPosts, options);

      expect(result.prevUrl).toBe('/blog?tag=React');
      expect(result.nextUrl).toBe('/blog/page/3?tag=React');
    });

    it('should handle empty items', () => {
      const options: PaginationOptions = {
        currentPage: 1,
        baseUrl: '/blog',
      };
      const result = paginate([], options);

      expect(result.items).toHaveLength(0);
      expect(result.totalItems).toBe(0);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
      expect(result.hasPrev).toBe(false);
      expect(result.hasNext).toBe(false);
    });
  });

  describe('filterByTag', () => {
    it('should filter items by tag', () => {
      const filtered = filterByTag(mockPosts, 'React');
      expect(filtered).toHaveLength(3);
      expect(filtered.every((post) => post.data.tags.includes('React'))).toBe(true);
    });

    it('should return all items when tag is null or undefined', () => {
      expect(filterByTag(mockPosts, null)).toHaveLength(7);
      expect(filterByTag(mockPosts, undefined as any)).toHaveLength(7);
    });

    it('should return empty array when no items match tag', () => {
      const filtered = filterByTag(mockPosts, 'NonExistent');
      expect(filtered).toHaveLength(0);
    });
  });

  describe('sortByDate', () => {
    it('should sort items by date descending by default', () => {
      const sorted = sortByDate(mockPosts);
      expect(sorted[0].id).toBe(3); // 2024-03-10
      expect(sorted[1].id).toBe(5); // 2024-03-05
      expect(sorted[2].id).toBe(1); // 2024-03-01
    });

    it('should sort items by date ascending when specified', () => {
      const sorted = sortByDate(mockPosts, 'asc');
      expect(sorted[0].id).toBe(7); // 2024-01-10
      expect(sorted[1].id).toBe(4); // 2024-01-20
      expect(sorted[2].id).toBe(6); // 2024-02-01
    });
  });
});
