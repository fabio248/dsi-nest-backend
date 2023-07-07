import { IsObject } from 'class-validator';
import { CreatePetDto } from '../../../pets/dto/input/create-pet.input';
import { CreateUserDto } from './create-user.input';

export class CreateUserWithPetDto extends CreateUserDto {
  @IsObject()
  pet: CreatePetDto;
}
