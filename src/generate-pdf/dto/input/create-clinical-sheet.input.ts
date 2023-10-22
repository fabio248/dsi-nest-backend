import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Matches,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { CreateVaccineHojaClinicaPetInput } from './create-vaccine-clinical-sheet.input';
import { CreateDewormingClinicalSheetInput } from './create-deworming.input';
import { CreateHeatClinicalSheetInput } from './create-heat.input';
import { Type } from 'class-transformer';

export class CreateClinicalSheetInput {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  clinicalNumber: number;

  @Type(() => CreateDewormingClinicalSheetInput)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  deworming: CreateDewormingClinicalSheetInput[];

  @Type(() => CreateVaccineHojaClinicaPetInput)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  vaccines: CreateVaccineHojaClinicaPetInput[];

  @Type(() => CreateHeatClinicalSheetInput)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  celos: CreateHeatClinicalSheetInput[];

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
