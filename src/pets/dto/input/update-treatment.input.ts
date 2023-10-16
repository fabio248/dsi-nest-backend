import { PartialType } from '@nestjs/swagger';
import { CreateTreatmentInput } from './create-treatment.input';

export class UpdateTreatmentDto extends PartialType(CreateTreatmentInput) {}
