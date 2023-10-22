import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateVaccinePetInput {
  @IsNotEmpty()
  @Matches(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'The valid format is dd/mm/yyyy',
  })
  dayAplication: string | Date;

  @IsNotEmpty()
  @IsString()
  vaccineName: string;

  @IsNotEmpty()
  @IsString()
  BrandAndLot: string;
}
