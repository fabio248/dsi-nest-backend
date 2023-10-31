import { IsNotEmpty, Matches, IsString } from 'class-validator';

export class CreateVaccineHojaClinicaPetInput {
  /**
   * Fecha de viaje dd/mm/aaaa
   * @example 24/11/2023
   */
  @IsNotEmpty()
  @Matches(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'The valid format is dd/mm/yyyy',
  })
  dayAplicationInit: string | Date;

  @IsNotEmpty()
  @IsString()
  vaccineName: string;

  /**
   * Fecha de viaje dd/mm/aaaa
   * @example 24/12/2023
   */
  @IsNotEmpty()
  @Matches(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'The valid format is dd/mm/yyyy',
  })
  dayAplicationfinal: string | Date;
}
