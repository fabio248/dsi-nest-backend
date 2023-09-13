import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateTreatmentInput {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPositive()
  days: number;

  @IsNotEmpty()
  @IsString()
  frecuency: string;
}
