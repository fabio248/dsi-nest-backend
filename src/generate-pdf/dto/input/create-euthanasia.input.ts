import { IsOptional, IsString } from 'class-validator';

export class CreateEuthanasiaInput {
  @IsOptional()
  @IsString()
  responsible?: string;
}
