import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';
import { GenericWithSearchArgs } from '../../../shared/args/generic-with-search.args';
import { toCsvArray } from '../../../shared/helper/cast.helper';
import { IsISODate } from '../../../shared/decorator/is-iso-date.decorator';

export enum UserSortBy {
  firstName = 'firstName',
  lastName = 'lastName',
  email = 'email',
  role = 'role',
  dui = 'dui',
  birthday = 'birthday',
  createdAt = 'createdAt',
}

export class FindAllUserArgs extends GenericWithSearchArgs {
  @IsOptional()
  @IsEnum(UserSortBy)
  sortBy?: UserSortBy;

  @IsOptional()
  @IsEnum(UserRole, { each: true })
  @Transform(({ value }) => toCsvArray(value))
  role?: UserRole[];

  @IsOptional()
  @IsISODate()
  birthdayFrom?: string;

  @IsOptional()
  @IsISODate()
  birthdayTo?: string;
}
