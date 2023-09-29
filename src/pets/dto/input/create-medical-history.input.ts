import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateFoodInput } from './create-food.input';
import { CreatePhysicalExamInput } from './create-physical-exam.input';
import { CreateOtherPetInput } from './create-other-pet.input';
import { Type } from 'class-transformer';
import { CreateDiagnosticInput } from './create-diagnostic.input';

export class CreateMedicalHistoryInput {
  @IsNotEmpty()
  @IsBoolean()
  isHaveAllVaccine: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isReproduced: boolean;

  @IsNotEmpty()
  @IsString()
  descendants: string;

  @IsNotEmpty()
  @IsString()
  room: string;

  @IsNotEmpty()
  @IsString()
  diasesEvaluation: string;

  @IsNotEmpty()
  @IsString()
  observation: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateFoodInput)
  food: CreateFoodInput;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreatePhysicalExamInput)
  physicalExam: CreatePhysicalExamInput;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOtherPetInput)
  otherPet: CreateOtherPetInput;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateDiagnosticInput)
  diagnostics: CreateDiagnosticInput;
}
