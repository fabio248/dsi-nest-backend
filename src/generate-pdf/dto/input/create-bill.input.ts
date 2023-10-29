import { IsString, IsOptional } from 'class-validator';

export class CreateBillInput {
  @IsOptional()
  @IsString()
  accountToSale?: string;
}
