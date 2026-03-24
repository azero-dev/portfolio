export interface PaginationResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
  prevUrl: string | null;
  nextUrl: string | null;
}

export interface PaginationOptions {
  itemsPerPage?: number;
  currentPage: number;
  baseUrl: string;
  tag?: string | null;
}

export function paginate<T>(items: T[], options: PaginationOptions): PaginationResult<T> {
  const itemsPerPage = options.itemsPerPage || 15;
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const currentPage = Math.max(1, Math.min(options.currentPage, totalPages));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = items.slice(startIndex, endIndex);

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const getPageUrl = (page: number) => {
    const base = page === 1 ? options.baseUrl : `${options.baseUrl}/page/${page}`;
    if (options.tag) {
      return `${base}?tag=${encodeURIComponent(options.tag)}`;
    }
    return base;
  };

  return {
    items: pageItems,
    totalItems,
    totalPages,
    currentPage,
    hasPrev,
    hasNext,
    prevUrl: hasPrev ? getPageUrl(currentPage - 1) : null,
    nextUrl: hasNext ? getPageUrl(currentPage + 1) : null,
  };
}

export function filterByTag<T extends { data: { tags: string[] } }>(
  items: T[],
  tag: string | null
): T[] {
  if (!tag) return items;
  return items.filter((item) => item.data.tags.includes(tag));
}

export function sortByDate<T extends { data: { pubDate: string | Date } }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.data.pubDate).getTime();
    const dateB = new Date(b.data.pubDate).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}
