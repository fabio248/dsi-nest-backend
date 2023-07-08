import { ApiHideProperty } from '@nestjs/swagger';
import { Food } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class FoodResponseDto implements Food {
  @Expose()
  id: number;

  @Expose()
  quantity: string;

  @Expose()
  type: string;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
