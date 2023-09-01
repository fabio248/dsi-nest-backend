/* eslint-disable prettier/prettier */
import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from './product.response';

export class FindAllProductsResponseDto {
  @Expose()
  @Type(() => ProductResponseDto)
  data: ProductResponseDto[];

  @Expose()
  totalItems: number;

  @Expose()
  totalPages: number;

  @Expose()
  hasNextPage: boolean;

  @Expose()
  hasPreviousPage: boolean;

  @Expose()
  nextPage: number | null;

  @Expose()
  previousPage: number | null;
}
