import { PartialType } from '@nestjs/swagger';
import { CreateSpeciesInput } from './create-species.input';

export class UpdateSpeciesInput extends PartialType(CreateSpeciesInput) {}
