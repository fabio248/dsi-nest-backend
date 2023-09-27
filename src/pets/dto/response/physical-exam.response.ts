import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class PhysicalExamResponseDto {
  @Expose()
  id: number;

  @Expose()
  weight: number;

  @Expose()
  palpitations: string;

  @Expose()
  temperature?: number;

  @Expose()
  respiratoryRate?: number;

  @Expose()
  cardiacRate?: number;

  @Expose()
  laboratoryExam?: string;

  @Expose()
  pulse?: string;

  @Expose()
  mucous?: string;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
