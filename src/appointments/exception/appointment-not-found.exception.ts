import { NotFoundException } from '@nestjs/common';

export class AppointmentNotFound extends NotFoundException {
  constructor(id: number) {
    super(`Appoinment with id: ${id} not found`);
  }
}
