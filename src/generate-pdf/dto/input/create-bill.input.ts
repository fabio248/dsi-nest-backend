import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateBillTableInput } from './create-bill-table.input';

export class CreateBillInput {
  @IsOptional()
  @IsString()
  accountToSale: string;

  @IsNotEmpty()
  @IsArray()
  tableFacture: CreateBillTableInput[];
}
