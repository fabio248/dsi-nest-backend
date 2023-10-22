import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEuthanasiaInput {
  @IsNotEmpty()
  @IsString()
  responsible: string;
}
