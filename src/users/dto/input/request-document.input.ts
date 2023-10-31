import { IsEnum, IsNotEmpty } from 'class-validator';
import { DocumentType } from '../enum/type-document.enum';

export class RequestDocumentInput {
  @IsNotEmpty()
  @IsEnum(DocumentType)
  typeDocument: DocumentType = DocumentType.HEALTH_CERTIFICATION;
}
