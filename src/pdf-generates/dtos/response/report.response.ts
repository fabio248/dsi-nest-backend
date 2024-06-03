import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../../users/dto/response';

@Exclude()
class ReportTypeResponseDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;
}

@Exclude()
export class ReportResponseDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly startDate?: Date;

  @Expose()
  readonly endDate?: Date;

  @Expose()
  readonly url: string;

  @Expose()
  @Type(() => ReportTypeResponseDto)
  readonly reportType: ReportTypeResponseDto;

  @Expose()
  @Type(() => UserResponseDto)
  readonly user: UserResponseDto;

  @Expose()
  readonly createdAt: Date;
}
