import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePetInput } from './create-pet.input';

class CreatePetInputWithOutMedicalHistories extends OmitType(CreatePetInput, [
  'medicalHistories',
]) {}
export class UpdatePetDto extends PartialType(
  CreatePetInputWithOutMedicalHistories,
) {}
