import { Expose, Type } from 'class-transformer';
import { PetResponseDto } from './pet.response';
import { OmitType } from '@nestjs/swagger';

export class PetResponseWitOutMedicalHistories extends OmitType(
  PetResponseDto,
  ['medicalHistories'] as const,
) {}

export class FindAllPetsResponseDto {
  @Expose()
  @Type(() => PetResponseWitOutMedicalHistories)
  data: PetResponseWitOutMedicalHistories[];

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
