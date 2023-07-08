import { PartialType } from '@nestjs/swagger';
import { CreateMedicalHistoryInput } from './create-medical-history.input';

export class UpdateMedicalHistoryDto extends PartialType(
  CreateMedicalHistoryInput,
) {}
