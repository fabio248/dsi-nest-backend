import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateMedicalHistoryInput } from './create-medical-history.input';
export class UpdateMedicalHistoryDto extends PartialType(
  OmitType(CreateMedicalHistoryInput, ['diagnostic']),
) {}
