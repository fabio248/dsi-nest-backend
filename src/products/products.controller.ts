/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateProductInput } from './dto/input/create-products-input';
import { UpdateProductDto } from './dto/input/update-product-inputs';
import { ProductResponseDto } from './dto/response/product.response';
import { ProductsService } from './products.service';
import { FindAllProductsArgs } from './dto/args/find-all-products_args';
import { FindAllproductsResponseDto } from './dto/response/find-all-products.response';

import RoleGuard from '../auth/guards/role.guard';
import { UserRole } from '../users/dto/enum/role.enum';

@ApiTags('Products')
@Controller('products')
@UseGuards(RoleGuard(UserRole.ADMIN))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth()
  @Post()
  create(
    @Body() createProductInput: CreateProductInput,
  ): Promise<ProductResponseDto> {
    return this.productsService.create(createProductInput);
  }

  @ApiBearerAuth()
  @Get(':productId')
  getProduct(@Param('productId') id: number): Promise<ProductResponseDto> {
    return this.productsService.getProduct(id);
  }

  @ApiBearerAuth()
  @Get()
  findAll(
    @Query() args?: FindAllProductsArgs,
  ): Promise<FindAllproductsResponseDto> {
    return this.productsService.findAll(args);
  }

  @ApiBearerAuth()
  @Delete(':productId')
  delete(@Param('productId') id: number): Promise<ProductResponseDto> {
    return this.productsService.delete(id);
  }

  @ApiBearerAuth()
  @Patch(':productId')
  updateProduct(
    @Param('productId') productId: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<UpdateProductDto> {
    return this.productsService.updateProduct(productId, updateProductDto);
  }
}
