import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateTableFacturaInput } from './create-table-factura.input';

export class CreateFacture {
  @IsOptional()
  @IsString()
  accountToSale: string;

  @IsNotEmpty()
  @IsArray()
  tableFacture: CreateTableFacturaInput[];
}
