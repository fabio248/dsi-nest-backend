/* eslint-disable prettier/prettier */
import { ApiHideProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import { CategoryProduct } from '../enum/enum.category';

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  nameProduct: string;

  @Expose()
  descriptionProduct: string;

  @Expose()
  category: CategoryProduct;

  @Expose()
  sizeProduct: string;

  @Expose()
  sellingProduct: number;

  @ApiHideProperty()
  @Exclude()
  createdAt: string;

  @ApiHideProperty()
  @Exclude()
  updatedAt: string;
}
