import { PartialType } from '@nestjs/swagger';
import { CreatePetInput } from './create-pet.input';

export class UpdatePetDto extends PartialType(CreatePetInput) {}
