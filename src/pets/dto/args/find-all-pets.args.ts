import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Gender } from '@prisma/client';
import { GenericWithSearchArgs } from '../../../shared/args/generic-with-search.args';
import {
  toCsvArray,
  toCsvNumberArray,
  toStrictBoolean,
  toStrictNumber,
} from '../../../shared/helper/cast.helper';
import { IsISODate } from '../../../shared/decorator/is-iso-date.decorator';

export enum PetSortBy {
  name = 'name',
  raza = 'raza',
  color = 'color',
  gender = 'gender',
  birthday = 'birthday',
  createdAt = 'createdAt',
  specie = 'specie',
  owner = 'owner',
}

export class FindAllPetsArgs extends GenericWithSearchArgs {
  @IsOptional()
  @IsEnum(PetSortBy)
  sortBy?: PetSortBy;

  @IsOptional()
  @IsInt({ each: true })
  @Transform(({ value }) => toCsvNumberArray(value))
  specieId?: number[];

  @IsOptional()
  @IsEnum(Gender, { each: true })
  @Transform(({ value }) => toCsvArray(value))
  gender?: Gender[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => toStrictBoolean(value))
  pedigree?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => toStrictBoolean(value))
  isHaveTatto?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => toStrictNumber(value))
  userId?: number;

  @IsOptional()
  @IsISODate()
  birthdayFrom?: string;

  @IsOptional()
  @IsISODate()
  birthdayTo?: string;
}
