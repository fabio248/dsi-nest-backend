import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(params: { id?: number; email?: string }) {
    if (params.id) {
      super(`User with id: ${params.id} not found`);
    } else {
      super(`User with email: ${params.email} not found`);
    }
  }
}
