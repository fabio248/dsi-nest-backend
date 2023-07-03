import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.input';
import { UserRole } from '../../entities/user.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = undefined;
}
