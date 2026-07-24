import { Gender } from '../enum/gender.enum';
import { Expose, Transform, Type } from 'class-transformer';
import { UserResponseDto } from '../../../users/dto/response/user.response';
import { MedicalHistoryResponseDto } from './medical-history.response';
import { SpecieResponseDto } from '../../../species/dto/response/specie.response';

export class PetResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  gender: Gender;

  @Expose()
  raza: string;

  @Expose()
  color: string;

  @Expose()
  isHaveTatto: boolean;

  @Expose()
  pedigree: boolean;

  @Expose()
  @Transform(({ value }) => value.toLocaleDateString('es-SV'))
  birthday: Date;

  @Expose()
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @Expose()
  @Type(() => MedicalHistoryResponseDto)
  medicalHistories: MedicalHistoryResponseDto[];

  @Expose()
  @Type(() => SpecieResponseDto)
  specie: SpecieResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
