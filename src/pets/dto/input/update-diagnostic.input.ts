import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDiagnosticInput } from './create-diagnostic.input';

export class UpdateDiagnosticDto extends PartialType(
  OmitType(CreateDiagnosticInput, ['treatments', 'surgicalIntervations']),
) {}
