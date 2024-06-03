import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import { FilesService } from '../../files/files.service';
import { FindAllReportResponseDto } from '../dtos/response/find-all-report.response';
import { plainToInstance } from 'class-transformer';
import { getPaginationParams } from '../../shared/helper/pagination-params.helper';
import { ReportResponseDto } from '../dtos/response/report.response';
import { GenericWithSearchArgs } from '../../shared/args/generic-with-search.args';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FilesService,
  ) {}

  async findAll(
    args: GenericWithSearchArgs,
  ): Promise<FindAllReportResponseDto> {
    const { page, limit } = args;

    const [reports, totalItems] = await Promise.all([
      this.prisma.report.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          deletedAt: null,
        },
        include: {
          file: true,
          reportType: true,
          user: true,
        },
      }),
      this.prisma.report.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    const [...transformedReports] = await Promise.all(
      reports.map(async (report) => {
        const url = await this.fileService.getUrlToGetFile(
          report.file.key,
          'reports',
        );
        return {
          ...report,
          url,
        };
      }),
    );

    console.log('transformedReports', transformedReports);

    return {
      data: plainToInstance(ReportResponseDto, transformedReports) as any,
      ...getPaginationParams(totalItems, page, limit),
    };
  }
}
