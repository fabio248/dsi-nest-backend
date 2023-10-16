import { PartialType } from '@nestjs/swagger';
import { CreateSurgicalInterventionInput } from './create-surgical-intervention.input';

export class UpdateSurgicalInterventionDto extends PartialType(
  CreateSurgicalInterventionInput,
) {}
