import { NotFoundException } from '@nestjs/common';

export class ProductNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`product with id: ${id} not found`);
  }
}
