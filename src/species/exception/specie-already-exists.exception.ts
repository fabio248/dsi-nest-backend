import { HttpException, HttpStatus } from '@nestjs/common';

export class SpecieAlreadyExitsException extends HttpException {
  constructor(name: string) {
    super(
      `Specie with name: ${name} already exits`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
