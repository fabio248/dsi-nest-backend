import { Gender } from '../enum/gender.enum';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { UserResponseDto } from '../../../users/dto/response/user.response';
import { MedicalHistoryResponseDto } from './medical-history.response';
import { SpecieResponseDto } from '../../../species/dto/response/specie.response';
import { ApiHideProperty } from '@nestjs/swagger';

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

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
