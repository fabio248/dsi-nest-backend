import { Expose } from 'class-transformer';
import { UserResponseDto } from './user.response';

export class UserWithPaginationResponseDto {
  @Expose()
  data: UserResponseDto[];

  @Expose()
  totalItems: number;

  @Expose()
  totalPages: number;

  @Expose()
  hasNextPage: boolean;

  @Expose()
  hasPreviosPage: boolean;

  @Expose()
  nextPage: number | null;

  @Expose()
  previousPage: number | null;
}
