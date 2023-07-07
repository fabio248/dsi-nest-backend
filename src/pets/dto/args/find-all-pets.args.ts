import { IsBoolean, IsOptional } from 'class-validator';
import { GenericArgs } from '../../../shared/args/generic.args';
import { Transform } from 'class-transformer';
import { toBoolean } from '../../../shared/helper/cast.helper';

export class FindAllPetsArgs extends GenericArgs {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  includeUserInfo?: boolean = false;
}
