import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

export class TreatmentResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  days: number;

  @Expose()
  frequency: string;

  @Expose()
  quantity: string;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
