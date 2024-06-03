import { PaginationResponse } from '../../../shared/args/pagination.response';
import { Expose, Type } from 'class-transformer';
import { ReportResponseDto } from './report.response';

export class FindAllReportResponseDto extends PaginationResponse {
  @Expose()
  @Type(() => ReportResponseDto)
  readonly data: ReportResponseDto;
}
