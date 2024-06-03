import { Injectable, Logger } from '@nestjs/common';
import { ProductResponseDto } from './dto/response/product.response';
import { CreateProductInput } from './dto/input/create-product.input';
import { PrismaService } from '../database/database.service';
import { Prisma, Category } from '@prisma/client';

import { plainToInstance } from 'class-transformer';
import { ProductNotFoundException } from './exception/product-not-found.exception';
import { FindAllProductsArgs } from './dto/args/find-all-products_args';
import { FindAllProductsResponseDto } from './dto/response/find-all-products.response';

import { getPaginationParams } from 'src/shared/helper/pagination-params.helper';
import { UpdateProductDto } from './dto/input/update-product.input';
import { faker } from '@faker-js/faker';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductInput,
  ): Promise<ProductResponseDto> {
    this.logger.log('Create product');

    const product = await this.prisma.product.create({
      data: {
        nameProduct: createProductDto.nameProduct,
        descriptionProduct: createProductDto.descriptionProduct,
        category: createProductDto.category,
        sizeProduct: createProductDto.sizeProduct,
        sellingProduct: createProductDto.sellingProduct,
      },
    });
    return plainToInstance(ProductResponseDto, product);
  }

  async getProduct(id: number): Promise<ProductResponseDto> {
    this.logger.log('Retrieve product');

    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new ProductNotFoundException(id);
    }
    return plainToInstance(ProductResponseDto, product);
  }

  async findAll(
    args: FindAllProductsArgs,
  ): Promise<FindAllProductsResponseDto> {
    this.logger.log('Retrieve all products');
    const { page, limit, search } = args;
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { descriptionProduct: { contains: search, mode: 'insensitive' } },
        { nameProduct: { contains: search, mode: 'insensitive' } },
        { sizeProduct: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, totalItems] = await Promise.all([
      this.prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where,
      }),
      this.prisma.product.count({ where }),
    ]);

    const paginationParams = getPaginationParams(totalItems, page, limit);
    return plainToInstance(FindAllProductsResponseDto, {
      data,
      ...paginationParams,
    });
  }

  async delete(id: number) {
    this.logger.log('Delete one product');

    const product = await this.findOneById(id);
    const deletProduct = this.prisma.product.delete({
      where: { id: Number(id) },
    });
    await this.prisma.$transaction([deletProduct]);
    return product;
  }

  async updateProduct(productId: number, updateProduct: UpdateProductDto) {
    this.logger.log('Update a Product');
    await this.findOneById(productId);

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: updateProduct,
    });

    return plainToInstance(UpdateProductDto, updatedProduct);
  }

  async findOneById(id: number): Promise<ProductResponseDto> {
    this.logger.log('Retrieve one user');

    const product = await this.prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    return plainToInstance(ProductResponseDto, product);
  }

  async createFakeProducts() {
    await this.prisma.product.create({
      data: {
        nameProduct: faker.commerce.productName(),
        descriptionProduct: faker.commerce.productDescription(),
        category: Category.medicamento,
        sizeProduct: faker.commerce.productAdjective(),
        sellingProduct: +faker.commerce.price({ min: 10, max: 200, dec: 2 }),
      },
    });
  }
}
