import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecoveryMailInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
