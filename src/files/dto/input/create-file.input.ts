import { IsEnum, IsNotEmpty } from 'class-validator';
import { mimeType } from '../../enum/mimetype.enum';

export class CreateFileDto {
  @IsEnum(mimeType)
  @IsNotEmpty()
  mimetype: mimeType;
}
