/* eslint-disable prettier/prettier */
import { Controller, Get, Res, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { GeneratePdfService } from './generate-pdf.service';
import { CreateDocumentInput } from './dto/input/create-constancia.input';

// Proteccion de controllador
// import RoleGuard from '../auth/guards/role.guard';
// import { UserRole } from '../users/dto/enum/role.enum';

@ApiTags('Generate-PDF')
@Controller('generate-pdf')
// @UseGuards(RoleGuard(UserRole.ADMIN))
export class GeneratePdfController {
  constructor(private readonly generatePdfService: GeneratePdfService) {}

  // @ApiBearerAuth()
  @Get('/constancia-salud/:idPet')
  async createPDF(
    @Param('idPet') idPet: number,
    @Body() createDocumentInput: CreateDocumentInput,
    @Res() res: Response,
  ) {
    await this.generatePdfService.generaPDFContanciaSalud(
      idPet,
      createDocumentInput,
      res,
    );
  }
}
