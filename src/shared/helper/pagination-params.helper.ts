import { PaginationParams } from '../types/pagination';

export function getPaginationParams(
  totalItems: number,
  page: number,
  limit: number,
): PaginationParams {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPreviosPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const previousPage = hasPreviosPage ? page - 1 : null;

  return {
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviosPage,
    nextPage,
    previousPage,
  };
}
