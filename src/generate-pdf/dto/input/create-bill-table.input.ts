import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBillTableInput {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;
}
