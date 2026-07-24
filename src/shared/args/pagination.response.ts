import { Expose } from 'class-transformer';

export class PaginationResponse {
  @Expose()
  readonly page: number;

  @Expose()
  readonly limit: number;

  @Expose()
  readonly totalItems: number;

  @Expose()
  readonly totalPages: number;

  @Expose()
  readonly hasNextPage: boolean;

  @Expose()
  readonly hasPreviousPage: boolean;

  @Expose()
  readonly nextPage: number | null;

  @Expose()
  readonly previousPage: number | null;
}
