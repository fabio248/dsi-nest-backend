import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class SpecieResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @ApiHideProperty()
  @Exclude()
  createdAt: string | Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: string | Date;
}
