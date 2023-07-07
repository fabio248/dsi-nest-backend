import { Gender, User } from '@prisma/client';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { UserResponseDto } from '../../../users/dto/response/user.response';

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
  user?: User;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
