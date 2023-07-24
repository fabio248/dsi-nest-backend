import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user.response';

export class FindAllUsersResponseDto {
  @Expose()
  @Type(() => UserResponseDto)
  data: UserResponseDto[];

  @Expose()
  totalItems: number;

  @Expose()
  totalPages: number;

  @Expose()
  hasNextPage: boolean;

  @Expose()
  hasPreviousPage: boolean;

  @Expose()
  nextPage: number | null;

  @Expose()
  previousPage: number | null;
}
