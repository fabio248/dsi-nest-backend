import { PartialType } from '@nestjs/swagger';
import { CreatePetDto } from './create-pet.input';

export class UpdatePetDto extends PartialType(CreatePetDto) {}
