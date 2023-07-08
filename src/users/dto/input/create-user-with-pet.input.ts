import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreatePetInput } from '../../../pets/dto/input/create-pet.input';
import { CreateUserInput } from './create-user.input';
import { Type } from 'class-transformer';

export class CreateUserWithPetInput extends CreateUserInput {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreatePetInput)
  pet: CreatePetInput;
}
