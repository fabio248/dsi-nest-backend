/* eslint-disable prettier/prettier */
import { Controller, Get, Res, UseGuards, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GeneratePdfService } from './generate-pdf.service';
import { CreateDocumentInput } from './dto/input/create-constancia.input';

// Proteccion de controllador
import RoleGuard from '../auth/guards/role.guard';
import { UserRole } from '../users/dto/enum/role.enum';
// import { Public } from 'src/auth/decorators/public-route.decorator';

@ApiTags('Generate-PDF')
@Controller('generate-pdf')
@UseGuards(RoleGuard(UserRole.ADMIN))
export class GeneratePdfController {
  constructor(private readonly generatePdfService: GeneratePdfService) {}

  @ApiBearerAuth()
  @Get('/constanciaSalud/:idPet')
  async createPDF(
    @Param('idPet') idPet: number,
    @Body() createDocumentInput: CreateDocumentInput,
    @Res() res: any,
  ) {
    await this.generatePdfService.generatePDF_ConstanciaSalud(
      idPet,
      createDocumentInput,
      res,
    );
  }
}
