import { NotFoundException } from '@nestjs/common';

export class TreatmentNotFoundException extends NotFoundException {
  constructor(treatmentId: number) {
    super(`Treatment with id ${treatmentId} not found`);
  }
}
