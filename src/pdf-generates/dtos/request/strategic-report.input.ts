import { IsDateString, IsOptional } from 'class-validator';

export class ReportInputDto {
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
