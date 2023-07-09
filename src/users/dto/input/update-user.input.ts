import { PartialType } from '@nestjs/swagger';
import { CreateUserInput } from './create-user.input';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../enum/role.enum';

export class UpdateUserDto extends PartialType(CreateUserInput) {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = undefined;

  @IsOptional()
  @IsString()
  recoveryToken: string;
}
