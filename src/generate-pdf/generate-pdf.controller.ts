/* eslint-disable prettier/prettier */
import { Controller, Get, Res, UseGuards, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { GeneratePdfService } from './generate-pdf.service';
import { CreateConstanciaSaludInput } from './dto/input/create-constancia.input';
import { CreateEutanasiaInput } from './dto/input/create-eutanasia.input';

// Proteccion de controllador
import RoleGuard from '../auth/guards/role.guard';
import { UserRole } from '../users/dto/enum/role.enum';
import { Public } from 'src/auth/decorators/public-route.decorator';

@ApiTags('Generate-PDF')
@Controller('generate-pdf')
@UseGuards(RoleGuard(UserRole.ADMIN))
export class GeneratePdfController {
  constructor(private readonly generatePdfService: GeneratePdfService) {}

  @ApiBearerAuth()
  @Public()
  @Get('/constancia-salud/:idPet')
  async createPDF_constancia_salud(
    @Param('idPet') idPet: number,
    @Body() createDocumentInput: CreateConstanciaSaludInput,
    @Res() res: Response,
  ) {
    await this.generatePdfService.generaPDFContanciaSalud(
      idPet,
      createDocumentInput,
      res,
    );
  }

  // @ApiBearerAuth()
  @Public()
  @Get('/eutanasia/:idPet')
  async createPDF_eutanasia(
    @Param('idPet') idPet: number,
    @Body() createEutanasiaInput: CreateEutanasiaInput,
    @Res() res: Response,
  ) {
    await this.generatePdfService.generatePDFEutanasia(
      idPet,
      createEutanasiaInput,
      res,
    );
  }
}
