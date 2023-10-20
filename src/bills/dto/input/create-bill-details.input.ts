import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateBillDetailsInput {
  @IsNotEmpty()
  @IsPositive()
  readonly quantity: number;

  @IsNotEmpty()
  @IsPositive()
  readonly productId: number;
}
