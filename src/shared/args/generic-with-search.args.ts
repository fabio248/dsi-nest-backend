import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { toOptionalTrimmed, toStrictNumber } from '../helper/cast.helper';
import { SortOrder } from './sort-order.enum';

export class GenericWithSearchArgs {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => toStrictNumber(value))
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => toStrictNumber(value))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => toOptionalTrimmed(value))
  search?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.asc;
}
