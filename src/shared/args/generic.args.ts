import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { toNumber } from '../helper/cast.helper';

export class GenericArgs {
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(25)
  @Transform(({ value }) => toNumber(value))
  skip?: number = 0;

  @IsPositive()
  @IsOptional()
  @Min(1)
  @Max(25)
  @Transform(({ value }) => toNumber(value))
  take?: number = 10;
}
