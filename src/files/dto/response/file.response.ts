import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class FileResponseDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  url: string;

  @Expose()
  readonly folderId: number;

  @Expose()
  readonly petId?: number;

  @Expose()
  readonly medicalHistoryId: number;

  @ApiHideProperty()
  @Exclude()
  readonly createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  readonly updatedAt: Date;
}
