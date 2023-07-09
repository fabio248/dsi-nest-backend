import { Exclude, Expose, Type } from 'class-transformer';
import { FoodResponseDto } from './food.response';
import { PhysicalExamResponseDto } from './physical-exam.response';
import { OtherPetResponseDto } from './other-pet.response';
import { ApiHideProperty } from '@nestjs/swagger';

export class MedicalHistoryResponseDto {
  @Expose()
  id: number;

  @Expose()
  isHaveAllVaccine: boolean;

  @Expose()
  isReproduced: boolean;

  @Expose()
  descendants: string;

  @Expose()
  room: string;

  @Expose()
  diasesEvaluation: string;

  @Expose()
  observation: string;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;

  @Exclude()
  foodId: number;

  @Exclude()
  physicalExamId: number;

  @Exclude()
  otherPetId: number;

  @Expose()
  @Type(() => FoodResponseDto)
  food: FoodResponseDto;

  @Expose()
  @Type(() => PhysicalExamResponseDto)
  physicalExam: PhysicalExamResponseDto;

  @Expose()
  @Type(() => OtherPetResponseDto)
  otherPet: OtherPetResponseDto;
}