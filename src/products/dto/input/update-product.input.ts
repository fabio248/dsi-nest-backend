/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CreateProductInput } from './create-product.input';
export class UpdateProductDto extends PartialType(CreateProductInput) {}
