import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { UserRole } from '../enum/role.enum';
import { PetResponseDto } from '../../../pets/dto/response/pet.response';

export class UserWithPetResponseDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  email: string;

  @Expose()
  lastName: string;

  @Expose()
  role: UserRole;

  @Expose()
  phone?: string;

  @Expose()
  direction?: string;

  @Expose()
  dui?: string;

  @Expose()
  @Type(() => PetResponseDto)
  pets?: PetResponseDto[];

  /**
   * La fecha es retornada en este formato: dd/mm/aaaa
   */
  @Expose()
  @Transform(({ value }) => value.toLocaleDateString('es-SV'))
  birthday?: Date;

  @ApiHideProperty()
  @Exclude()
  password: string;

  @ApiHideProperty()
  @Exclude()
  createdAt: string;

  @ApiHideProperty()
  @Exclude()
  updatedAt: string;

  recoveryToken: string;
}
