import { IsDateString, IsOptional } from 'class-validator';

export class StrategicReportDto {
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
