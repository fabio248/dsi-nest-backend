import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { toNumber } from '../../../shared/helper/cast.helper';

export class FindAllUserArgs {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => toNumber(value))
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  @Min(1)
  @Max(25)
  @Transform(({ value }) => toNumber(value))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}
