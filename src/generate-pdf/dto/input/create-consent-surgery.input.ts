import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConsentSurgeryInput {
  @IsNotEmpty()
  @IsString()
  intervention: string;
}
