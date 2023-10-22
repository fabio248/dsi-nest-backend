import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateClinicalSheetInput {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  clinicalNumber: number;

  @IsNotEmpty()
  @IsArray()
  deworming: string[];

  @IsNotEmpty()
  @IsArray()
  vaccines: string[];

  @IsNotEmpty()
  @IsArray()
  celos: string[];

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
