import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidDateAppointmentException extends HttpException {
  constructor() {
    super('This date is already taken', HttpStatus.CONFLICT);
  }
}
