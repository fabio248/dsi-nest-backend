/* eslint-disable prettier/prettier */
import {
  // IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Product } from '../enum/enum.category';
export class CreateProductInput {
  @IsNotEmpty()
  @IsString()
  nameProduct: string;

  @IsNotEmpty()
  @IsString()
  descriptionProduct: string;

  @IsOptional()
  @IsEnum(Product)
  category: Product;

  @IsNotEmpty()
  @IsString()
  sizeProduct: string;

  @IsNotEmpty()
  @IsNumber()
  sellingProduct: number;
}
