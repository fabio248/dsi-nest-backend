import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { trimAndcapitalizeFirstLetter } from '../../../shared/helper/cast.helper';

export class CreateSpeciesInput {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) =>
    trimAndcapitalizeFirstLetter(value),
  )
  name: string;
}
