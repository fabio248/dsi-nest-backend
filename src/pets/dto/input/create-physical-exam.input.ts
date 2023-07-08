import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePhysicalExamInput {
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  weight: number;

  @IsString()
  @IsNotEmpty()
  palpitations: string;
}
