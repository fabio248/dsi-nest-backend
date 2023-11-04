import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateTreatmentInput } from './create-treatment.input';
import { Type } from 'class-transformer';
import { CreateSurgicalInterventionInput } from './create-surgical-intervention.input';

export class CreateDiagnosticInput {
  @IsNotEmpty()
  @IsString()
  description: string;

  @Type(() => CreateTreatmentInput)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  treatments: CreateTreatmentInput[];

  @Type(() => CreateSurgicalInterventionInput)
  @ValidateNested({ each: true })
  @IsOptional()
  surgicalIntervations?: CreateSurgicalInterventionInput[];
}
