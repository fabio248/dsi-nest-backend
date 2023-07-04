import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '../../entities/user.entity';

export class UserResponse {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  email: string;

  @Expose()
  lastName: string;

  @Expose()
  phone: string;

  @Expose()
  direction: string;

  @Expose()
  dui: string;

  @Expose()
  role: UserRole;

  @Expose()
  birthday: Date;

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
