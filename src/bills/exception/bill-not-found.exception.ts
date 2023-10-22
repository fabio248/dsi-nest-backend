import { NotFoundException } from '@nestjs/common';

export class BillNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Bill with id ${id} not found`);
  }
}
