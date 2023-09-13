import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

export class TreamentResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  days: number;

  @Expose()
  frecuency: string;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
