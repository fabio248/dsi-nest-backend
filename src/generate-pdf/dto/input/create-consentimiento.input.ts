import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConsentimientoInput {
  @IsNotEmpty()
  @IsString()
  responsibleLegal: string;

  @IsNotEmpty()
  @IsString()
  intervention: string;
}
