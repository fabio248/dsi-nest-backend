import { PartialType } from '@nestjs/swagger';
import { CreatePhysicalExamInput } from './create-physical-exam.input';

export class UpdatePhysicalExamDto extends PartialType(
  CreatePhysicalExamInput,
) {}
