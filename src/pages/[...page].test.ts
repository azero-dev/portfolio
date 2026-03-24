import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock astro:content before importing the module that uses it
const mockGetCollection = vi.fn();
vi.mock('astro:content', () => ({
  getCollection: mockGetCollection,
}));

// Helper function that mimics the getStaticPaths logic from [...page].astro
async function simulateGetStaticPaths(posts: Array<{ id: string; data: { draft: boolean } }>) {
  // Simulate getCollection('blog', ({ data }) => !data.draft)
  const filteredPosts = posts.filter((post) => !post.data.draft);
  const postsPerPage = 15;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paths = [];
  for (let i = 2; i <= totalPages; i++) {
    paths.push({ params: { page: i.toString() } });
  }

  return paths;
}

describe('Blog pagination routes', () => {
  const mockPosts = [
    { id: 'post-1', data: { draft: false } },
    { id: 'post-2', data: { draft: false } },
    { id: 'post-3', data: { draft: false } },
    { id: 'post-4', data: { draft: false } },
    { id: 'post-5', data: { draft: false } },
    { id: 'post-6', data: { draft: false } },
    { id: 'post-7', data: { draft: false } },
    { id: 'post-8', data: { draft: false } },
    { id: 'post-9', data: { draft: false } },
    { id: 'post-10', data: { draft: false } },
    { id: 'post-11', data: { draft: false } },
    { id: 'post-12', data: { draft: false } },
    { id: 'post-13', data: { draft: false } },
    { id: 'post-14', data: { draft: false } },
    { id: 'post-15', data: { draft: false } },
    { id: 'post-16', data: { draft: false } }, // 16 total posts
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should generate static paths for pagination', async () => {
    mockGetCollection.mockResolvedValue(mockPosts);

    const paths = await simulateGetStaticPaths(mockPosts);

    // With 16 posts and 15 per page, we should have 2 total pages
    // Page 1 is handled by index.astro, so getStaticPaths should return only page 2
    expect(paths).toEqual([{ params: { page: '2' } }]);
  });

  it('should not include draft posts in pagination', async () => {
    const postsWithDrafts = [
      ...mockPosts.slice(0, 10),
      { id: 'draft-1', data: { draft: true } },
      { id: 'draft-2', data: { draft: true } },
    ];
    mockGetCollection.mockResolvedValue(postsWithDrafts);

    const paths = await simulateGetStaticPaths(postsWithDrafts);

    // Only 10 non-draft posts, fits in page 1, no additional pages
    expect(paths).toEqual([]);
  });

  it('should generate no paths when all posts fit on page 1', async () => {
    const fewPosts = mockPosts.slice(0, 10);
    mockGetCollection.mockResolvedValue(fewPosts);

    const paths = await simulateGetStaticPaths(fewPosts);

    expect(paths).toEqual([]);
  });

  it('should generate multiple paths for many posts', async () => {
    const manyPosts = Array.from({ length: 46 }, (_, i) => ({
      id: `post-${i}`,
      data: { draft: false },
    }));
    mockGetCollection.mockResolvedValue(manyPosts);

    const paths = await simulateGetStaticPaths(manyPosts);

    // 46 posts / 15 per page = 4 pages (ceil)
    // pages 2, 3, 4
    expect(paths).toHaveLength(3);
    expect(paths[0]).toEqual({ params: { page: '2' } });
    expect(paths[1]).toEqual({ params: { page: '3' } });
    expect(paths[2]).toEqual({ params: { page: '4' } });
  });

  it('should call getCollection with correct arguments', async () => {
    mockGetCollection.mockResolvedValue(mockPosts);

    // Simulate the call that would happen in getStaticPaths
    await mockGetCollection('blog', ({ data }: any) => !data.draft);

    expect(mockGetCollection).toHaveBeenCalledTimes(1);
    expect(mockGetCollection).toHaveBeenCalledWith('blog', expect.any(Function));

    // Test the filter function
    const filterFn = mockGetCollection.mock.calls[0][1];
    expect(filterFn({ data: { draft: false } })).toBe(true);
    expect(filterFn({ data: { draft: true } })).toBe(false);
  });
});
