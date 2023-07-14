import { PartialType } from '@nestjs/swagger';
import { CreateFileDto } from './create-file.input';

export class UpdateFileDto extends PartialType(CreateFileDto) {}
