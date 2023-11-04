import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePhysicalExamInput {
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  weight: number;

  @IsString()
  @IsNotEmpty()
  palpitations: string;

  @IsOptional()
  @Transform(({ value }) => +value)
  temperature?: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  respiratoryRate?: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  cardiacRate?: number;

  @IsOptional()
  @IsString()
  laboratoryExam?: string;

  @IsOptional()
  @IsString()
  pulse?: string;

  @IsOptional()
  @IsString()
  mucous?: string;
}
