import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEutanasiaInput {
  @IsNotEmpty()
  @IsString()
  responsible: string;
}
