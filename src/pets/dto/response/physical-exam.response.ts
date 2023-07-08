import { ApiHideProperty } from '@nestjs/swagger';
import { PhysicalExam } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class PhysicalExamResponseDto implements PhysicalExam {
  @Expose()
  id: number;

  @Expose()
  weight: number;

  @Expose()
  palpitations: string;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
