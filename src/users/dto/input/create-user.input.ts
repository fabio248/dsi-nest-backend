import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';
import { UserRole } from '../../entities/user.entity';
import { Transform } from 'class-transformer';
import { hashSync } from 'bcryptjs';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => hashSync(value, 10))
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  /**
   * Fecha nacimiento en formato dd/mm/aaaa
   * @example 19/12/2000
   */
  @IsNotEmpty()
  @Matches(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'The valid format is dd/mm/yyyy',
  })
  birthday: string | Date;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  direction?: string;

  /**
   * Documento de identificacion en formato 00000000-0
   * @example 06050576-2
   */
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}-\d$/, { message: 'The valid format is 00000000-0' })
  dui?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.CLIENT;
}
