import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateAppointmentInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Matches(/^((0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}) (\d{2}:\d{2})$/, {
    message: 'startDate format valid is dd/mm/yyyy HH:MM',
  })
  startDate: string | Date;

  @IsNotEmpty()
  @Matches(/^((0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}) (\d{2}:\d{2})$/, {
    message: 'endDate format valid is dd/mm/yyyy HH:MM',
  })
  endDate: string | Date;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEmail()
  emailClient: string;
}
