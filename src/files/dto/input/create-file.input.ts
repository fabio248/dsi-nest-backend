import { IsEnum, IsNotEmpty, IsPositive } from 'class-validator';
import { mimeType } from '../../enum/mimetype.enum';

export class CreateFileDto {
  @IsEnum(mimeType)
  @IsNotEmpty()
  mimetype: mimeType;

  @IsNotEmpty()
  @IsPositive()
  medicalHistoryId: number;
}
