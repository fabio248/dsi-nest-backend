import {IsDateString, IsNotEmpty} from "class-validator";

export class StrategicReportDto {
    @IsNotEmpty()
    @IsDateString()
    startDate: Date;

    @IsNotEmpty()
    @IsDateString()
    endDate?: Date;
}