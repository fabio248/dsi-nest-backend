import { ApiHideProperty } from '@nestjs/swagger';
import { OtherPet } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class OtherPetResponseDto implements OtherPet {
  @Expose()
  id: number;

  @Expose()
  isLiveOtherPets: boolean;

  @Expose()
  whichPets: string;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
