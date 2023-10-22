/* eslint-disable prettier/prettier */
import {
  Controller,
  Res,
  UseGuards,
  Body,
  Param,
  Query,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { GeneratePdfService } from './generate-pdf.service';
//schemas de entrada validadas
import {
  CreateHealthCertificateInput,
  CreateEuthanasiaInput,
  CreateConsentSurgeryInput,
  CreateClinicalSheetInput,
} from './dto/input';
// Proteccion de controllador
import RoleGuard from '../auth/guards/role.guard';
import { UserRole } from '../users/dto/enum/role.enum';

@ApiTags('Generate PDF')
@Controller('generate-pdf')
@UseGuards(RoleGuard(UserRole.ADMIN))
export class GeneratePdfController {
  constructor(private readonly generatePdfService: GeneratePdfService) {}

  @ApiBearerAuth()
  @Post('/health-certificate/:idPet')
  async createPDFHealthCertificate(
    @Param('idPet') idPet: number,
    @Body() createDocumentInput: CreateHealthCertificateInput,
    @Res() res: Response,
  ) {
    return this.generatePdfService.generatePDFHealthCertificate(
      idPet,
      createDocumentInput,
      res,
    );
  }

  @ApiBearerAuth()
  @Post('/euthanasia/:idPet')
  async createPDFEuthanasia(
    @Param('idPet') idPet: number,
    @Body() createEutanasiaInput: CreateEuthanasiaInput,
    @Res() res: Response,
  ) {
    return this.generatePdfService.generatePDFEuthanasia(
      idPet,
      createEutanasiaInput,
      res,
    );
  }

  @ApiBearerAuth()
  @Post('/consent-surgery/:idPet')
  async createPDFConsentSurgery(
    @Param('idPet') idPet: number,
    @Body() createConsentSurgeryInput: CreateConsentSurgeryInput,
    @Res() res: Response,
  ) {
    return this.generatePdfService.generatePDFConsentSurgery(
      idPet,
      createConsentSurgeryInput,
      res,
    );
  }

  @ApiBearerAuth()
  @Post('/clinical-sheet/:idPet')
  async createPDFClinicalSheet(
    @Param('idPet') idPet: number,
    @Query('medicalHistoryId') medicalHistoryId: number,
    @Body() createHojaClinicaInput: CreateClinicalSheetInput,
    @Res() res: Response,
  ) {
    return this.generatePdfService.generatePDFClinicalSheet(
      idPet,
      createHojaClinicaInput,
      res,
      medicalHistoryId,
    );
  }
}
