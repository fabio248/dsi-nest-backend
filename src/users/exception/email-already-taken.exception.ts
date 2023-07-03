import { ConflictException } from '@nestjs/common';

export class EmailAlreadyTakenException extends ConflictException {
  constructor(email: string) {
    super(`${email} already taken`);
  }
}
