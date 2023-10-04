import { NotFoundException } from '@nestjs/common';

export class DiagnosticNotFoundException extends NotFoundException {
  constructor(data: { medicalHistoryId?: number; diagnosticId?: number }) {
    if (data.medicalHistoryId) {
      super(
        `Diagnostic not found, the medical history with id ${data.medicalHistoryId} does not have a diagnostic`,
      );
    } else {
      super(`Diagnostic with id ${data.diagnosticId} not found`);
    }
  }
}
