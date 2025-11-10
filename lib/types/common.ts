export type PaginatedResult<T> = {
  items: T[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
};

export const createPaginatedResult = <T>(
  items: T[],
  totalCount: number,
  page: number,
  limit: number,
): PaginatedResult<T> => {
  const totalPages = Math.ceil(totalCount / limit);
  return {
    items,
    totalCount,
    totalPages,
    page,
    limit,
  };
};
