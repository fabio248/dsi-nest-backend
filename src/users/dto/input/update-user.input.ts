import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.input';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../enum/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = undefined;
}
