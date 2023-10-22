import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Matches,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { CreateVaccineHojaClinicaPetInput } from './create-vaccine-hoja-clinica.input';
import { CreateDewormingHojaClinicaInput } from './create-deworming.input';
import { CreateCelosHojaClinicaInput } from './create-celos.input';
import { Type } from 'class-transformer';

export class CreateHojaClinicaInput {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  clinicalNumber: number;

  @Type(() => CreateDewormingHojaClinicaInput)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  deworming: CreateDewormingHojaClinicaInput[];

  @Type(() => CreateVaccineHojaClinicaPetInput)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  vaccines: CreateVaccineHojaClinicaPetInput[];

  @Type(() => CreateCelosHojaClinicaInput)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  celos: CreateCelosHojaClinicaInput[];

  @IsNotEmpty()
  @IsString()
  moreImportsData: string;

  @IsOptional()
  @Matches(/^[0-9]{4}-[0-9]{4}$/, {
    message: 'The valid format is 0000-0000',
  })
  phoneOffice: number;

  @IsOptional()
  @Matches(/^[0-9]{4}-[0-9]{4}$/, {
    message: 'The valid format is 0000-0000',
  })
  phoneFijo: string;
}
