/* eslint-disable prettier/prettier */
import { Controller, Get, Res, Param, UseGuards } from '@nestjs/common';
import { GeneratePdfService } from './generate-pdf.service';
import { ApiTags } from '@nestjs/swagger';

// Proteccion de controllador
import RoleGuard from '../auth/guards/role.guard';
import { UserRole } from '../users/dto/enum/role.enum';
import { Public } from 'src/auth/decorators/public-route.decorator';

@ApiTags('Generate-PDF')
@Controller('generate-pdf')
@UseGuards(RoleGuard(UserRole.ADMIN))
export class GeneratePdfController {
  constructor(private readonly generatePdfService: GeneratePdfService) {}

  // @ApiBearerAuth()
  @Public()
  @Get('/filename')
  async createPDF(@Param('id') id: number, @Res() res: any) {
    await this.generatePdfService.generatePDF(id, res);
  }
}
