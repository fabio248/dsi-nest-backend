import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsPositive,
  Min,
  Max,
  Matches,
  ValidateNested,
  IsOptional,
} from 'class-validator';

import { CreateVaccinePetInput } from './create-vaccines.input';
import { Type } from 'class-transformer';

export class CreateHealthCertificateInput {
  @IsOptional()
  @IsString()
  microChip: string;

  @IsNotEmpty()
  @IsString()
  responsible: string;

  @IsNotEmpty()
  @IsString()
  destinationAdress: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(100)
  @Max(999)
  codePostal: number;

  @Type(() => CreateVaccinePetInput)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  vaccines: CreateVaccinePetInput[];

  @IsNotEmpty()
  @Matches(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'The valid format is dd/mm/yyyy',
  })
  dateJourney: Date;
}
