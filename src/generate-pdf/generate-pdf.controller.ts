/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Res,
  UseGuards,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { GeneratePdfService } from './generate-pdf.service';
//schemas de entrada validadas
import { CreateConstanciaSaludInput } from './dto/input/create-constancia.input';
import { CreateEutanasiaInput } from './dto/input/create-eutanasia.input';
import { CreateConsentimientoInput } from './dto/input/create-consentimiento.input';
import { CreateHojaClinicaInput } from './dto/input/create-hoja-clinica.input';
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
    return this.generatePdfService.generaPDFContanciaSalud(
      idPet,
      createDocumentInput,
      res,
    );
  }

  @ApiBearerAuth()
  @Get('/eutanasia/:idPet')
  async createPDF_eutanasia(
    @Param('idPet') idPet: number,
    @Body() createEutanasiaInput: CreateEutanasiaInput,
    @Res() res: Response,
  ) {
    return this.generatePdfService.generatePDFEutanasia(
      idPet,
      createEutanasiaInput,
      res,
    );
  }

  @ApiBearerAuth()
  @Get('/consentimiento-cirugia/:idPet')
  async createPDF_Consentimiento(
    @Param('idPet') idPet: number,
    @Body() createConsentimientoInput: CreateConsentimientoInput,
    @Res() res: Response,
  ) {
    return this.generatePdfService.generatePDFConsentimiento(
      idPet,
      createConsentimientoInput,
      res,
    );
  }

  @ApiBearerAuth()
  @Public()
  @Get('/hoja-clinica/:idPet')
  async createPDF_Hoja_Clinica(
    @Param('idPet') idPet: number,
    @Query('medicalHistoryId') medicalHistoryId: number,
    @Body() createHojaClinicaInput: CreateHojaClinicaInput,
    @Res() res: Response,
  ) {
    return this.generatePdfService.generatePDFHojaClinica(
      idPet,
      createHojaClinicaInput,
      res,
      medicalHistoryId,
    );
  }
}
