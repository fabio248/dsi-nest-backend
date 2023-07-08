import { Type } from 'class-transformer';
import { UpdateMedicalHistoryDto } from './update-medical-history.input';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Gender } from '../enum/gender.enum';

export class UpdatePetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  isHaveTatto?: boolean;

  @IsOptional()
  @IsBoolean()
  pedigree?: boolean;

  /**
   * Fecha nacimiento en formato dd/mm/aaaa
   * @example 19/12/2000
   */
  @IsOptional()
  @Matches(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'The valid format is dd/mm/yyyy',
  })
  birthday?: string | Date;

  @IsOptional()
  @IsPositive()
  specieId?: number;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpdateMedicalHistoryDto)
  medicalHistory?: UpdateMedicalHistoryDto;
}
