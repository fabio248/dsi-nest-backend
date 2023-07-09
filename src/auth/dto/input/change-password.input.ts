import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

export class ChangePasswordInput {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => bcrypt.hashSync(value, 10))
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  recoveryToken: string;
}
