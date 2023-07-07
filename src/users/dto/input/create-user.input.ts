import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../enum/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => bcrypt.hashSync(value, 10))
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

  /**
   * Numero de telefono en formato 0000-0000
   * @example 7667-6833
   */
  @IsOptional()
  @Matches(/^[0-9]{4}-[0-9]{4}$/, {
    message: 'The valid format is 0000-0000',
  })
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
