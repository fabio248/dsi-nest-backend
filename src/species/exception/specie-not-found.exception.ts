import { NotFoundException } from '@nestjs/common';

export class SpecieNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Specie with id: ${id} not found`);
  }
}
