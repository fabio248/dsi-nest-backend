import { ApiHideProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

export class UserResponseDto {
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
}
