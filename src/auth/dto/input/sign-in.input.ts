import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
