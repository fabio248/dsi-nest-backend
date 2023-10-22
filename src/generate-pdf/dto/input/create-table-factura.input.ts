import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTableFacturaInput {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;
}
