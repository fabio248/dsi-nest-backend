import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFoodInput {
  @IsString()
  @IsNotEmpty()
  quantity: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
