import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PdfGeneratesService } from './pdf-generates.service';
import RoleGuard from '../auth/guards/role.guard';
import { UserRole } from '../users/dto/enum/role.enum';
import { CurrentUser } from '../shared/decorator/current-user.decorator';
import { Response } from 'express';
import { StrategicReportDto } from './dtos/request/strategic-report.input';
import { JwtPayload } from '../auth/interfaces/jwt.interface';

@ApiTags('Reports Endpoints')
@UseGuards(RoleGuard(UserRole.ADMIN))
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly pdfGeneratesService: PdfGeneratesService) {}

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
}
