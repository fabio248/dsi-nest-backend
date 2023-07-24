import { Expose, Type } from 'class-transformer';
import { PetResponseDto } from './pet.response';

export class FindAllPetsResponseDto {
  @Expose()
  @Type(() => PetResponseDto)
  data: PetResponseDto[];

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
