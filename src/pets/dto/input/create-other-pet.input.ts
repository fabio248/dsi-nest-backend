import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOtherPetInput {
  @IsBoolean()
  @IsNotEmpty()
  isLiveOtherPets: boolean;

  @IsString()
  @IsOptional()
  whichPets?: string;
}
