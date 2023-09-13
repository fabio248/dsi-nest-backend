import { Exclude, Expose, Type } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { SurgicalInterventionResponseDto } from './surgical-intervention.response';
import { TreamentResponseDto } from './treament.response';

export class DiagnosticResponseDto {
  @Expose()
  id: number;

  @Expose()
  description: string;

  @Expose()
  @Type(() => SurgicalInterventionResponseDto)
  surgicalIntervations?: SurgicalInterventionResponseDto[];

  @Expose()
  @Type(() => SurgicalInterventionResponseDto)
  treatments: TreamentResponseDto[];

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
