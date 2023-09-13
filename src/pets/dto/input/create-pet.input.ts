import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Gender } from '../enum/gender.enum';
import { CreateMedicalHistoryInput } from './create-medical-history.input';
import { Type } from 'class-transformer';

export class CreatePetInput {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  raza: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsBoolean()
  isHaveTatto: boolean;

  @IsNotEmpty()
  @IsBoolean()
  pedigree: boolean;

  /**
   * Fecha nacimiento en formato dd/mm/aaaa
   * @example 19/12/2000
   */
  @IsNotEmpty()
  @Matches(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'The valid format is dd/mm/yyyy',
  })
  birthday: string | Date;

  @IsNotEmpty()
  @IsPositive()
  specieId: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateMedicalHistoryInput)
  medicalHistories: CreateMedicalHistoryInput;
}
