export interface PaginationParams {
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviosPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}
