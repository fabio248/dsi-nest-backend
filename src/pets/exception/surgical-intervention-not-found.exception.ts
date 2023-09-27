import { NotFoundException } from '@nestjs/common';

export class SurgicalInterventionNotFoundException extends NotFoundException {
  constructor(surgicalInterventionId: number) {
    super(`Surgical intervention with id ${surgicalInterventionId} not found`);
  }
}
