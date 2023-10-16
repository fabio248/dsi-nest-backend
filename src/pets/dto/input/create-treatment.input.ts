import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateTreatmentInput {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPositive()
  days: number;

  /**
   * Cada cuanto se le da el medicamento
   * @example 'cada 8 horas'
   */
  @IsNotEmpty()
  @IsString()
  frequency: string;

  /**
   * Cantidad de medicamento
   * @example '1/2 tableta'
   */
  @IsNotEmpty()
  @IsString()
  quantity: string;
}
