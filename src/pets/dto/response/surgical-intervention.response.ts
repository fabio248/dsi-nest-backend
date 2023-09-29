import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

export class SurgicalInterventionResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  @Transform(({ value }) => value?.toLocaleDateString('es-SV'))
  intervationDate: Date;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
