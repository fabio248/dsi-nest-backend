import { IsNotEmpty, Matches, IsString } from 'class-validator';

export class CreateVaccineHojaClinicaPetInput {
  @IsNotEmpty()
  @Matches(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'The valid format is dd/mm/yyyy',
  })
  dayAplicationInit: string | Date;

  @IsNotEmpty()
  @IsString()
  vaccineName: string;

  @IsNotEmpty()
  @Matches(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'The valid format is dd/mm/yyyy',
  })
  dayAplicationfinal: string | Date;
}
