/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CategoryProduct } from '../enum/enum.category';
import { Category } from '@prisma/client';

export class CreateProductInput {
  @IsNotEmpty()
  @IsString()
  nameProduct: string;

  @IsNotEmpty()
  @IsString()
  descriptionProduct: string;

  @IsNotEmpty()
  @IsEnum(CategoryProduct)
  category: Category;

  @IsNotEmpty()
  @IsString()
  sizeProduct: string;

  @IsNotEmpty()
  @IsNumber()
  sellingProduct: number;
}
