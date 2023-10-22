import { IsNotEmpty, IsPositive, ValidateNested } from 'class-validator';
import { CreateBillDetailsInput } from './create-bill-details.input';
import { Type } from 'class-transformer';

export class CreateBillInput {
  @IsNotEmpty()
  @IsPositive()
  readonly clientId: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateBillDetailsInput)
  readonly billsDetails: CreateBillDetailsInput[];
}
