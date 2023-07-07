import { NotFoundException } from '@nestjs/common';

export class PetNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`pet with id: ${id} not found`);
  }
}
