import { NotFoundException } from '@nestjs/common';

export class DiagnosticNotFoundException extends NotFoundException {
  constructor(medicalHistoryId: number) {
    super(
      `Diagnostic not found, the medical history with id ${medicalHistoryId} does not have a diagnostic`,
    );
  }
}
