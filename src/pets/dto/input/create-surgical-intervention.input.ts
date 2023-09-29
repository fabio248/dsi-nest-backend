import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateSurgicalInterventionInput {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description?: string;

  /**
   * Dia de intervención en formato dd/mm/aaaa
   * @example 31/01/2024
   */
  @IsNotEmpty()
  @Matches(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'The valid format is dd/mm/yyyy',
  })
  intervationDate: Date | string;
}
