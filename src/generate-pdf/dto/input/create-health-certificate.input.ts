import {
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
  IsOptional,
} from 'class-validator';

import { CreateVaccinePetInput } from './create-vaccines.input';
import { Type } from 'class-transformer';

export class CreateHealthCertificateInput {
  @IsOptional()
  @IsString()
  microChip?: string;

  @IsOptional()
  @IsString()
  responsible?: string;

  @IsNotEmpty()
  @IsString()
  destinationAdress: string;

  @IsNotEmpty()
  @IsString()
  codePostal: string;

  @Type(() => CreateVaccinePetInput)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  vaccines: CreateVaccinePetInput[];

  /**
   * Fecha de viaje dd/mm/aaaa
   * @example 24/11/2023
   */
  @IsNotEmpty()
  @Matches(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'The valid format is dd/mm/yyyy',
  })
  dateJourney: Date;
}
