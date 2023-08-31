/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CreateProductInput } from './create-products-input';

export class UpdateProductDto extends PartialType(CreateProductInput) {}
