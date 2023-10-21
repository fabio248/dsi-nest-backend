import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConsentimientoInput {
  @IsNotEmpty()
  @IsString()
  intervention: string;
}
