import { NotFoundException } from '@nestjs/common';

export class MedicalHistoryNotFoundException extends NotFoundException {
  constructor(medicalHistoryId: number) {
    super(`Medical history with id ${medicalHistoryId} not found`);
  }
}
