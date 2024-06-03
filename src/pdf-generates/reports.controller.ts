import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PdfGeneratesService } from './services/pdf-generates.service';
import RoleGuard from '../auth/guards/role.guard';
import { UserRole } from '../users/dto/enum/role.enum';
import { CurrentUser } from '../shared/decorator/current-user.decorator';
import { Response } from 'express';
import { StrategicReportDto } from './dtos/request/strategic-report.input';
import { JwtPayload } from '../auth/interfaces/jwt.interface';
import { ReportsService } from './services/reports.service';
import { GenericWithSearchArgs } from '../shared/args/generic-with-search.args';

@ApiTags('Reports Endpoints')
@UseGuards(RoleGuard(UserRole.ADMIN))
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly pdfGeneratesService: PdfGeneratesService,
    private readonly reportsService: ReportsService,
  ) {}

  @Post('strategic')
  async strategicGenerate(
    @Res() res: Response,
    @CurrentUser() user: JwtPayload,
    @Body() strategicReportDto: StrategicReportDto,
  ) {
    return this.pdfGeneratesService.strategicGenerate(
      res,
      user,
      strategicReportDto,
    );
  }

  @Get('')
  async findAll(@Query() args: GenericWithSearchArgs) {
    return this.reportsService.findAll(args);
  }
}
