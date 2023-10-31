/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import {
  formatDocument,
  formatDocumentBill,
  identifierFileName,
} from './conditions-format/conditions-format-constancia-salud';
import { PetsService } from 'src/pets/pets.service';
import { BillsService } from 'src/bills/services/bills.service';
import {
  CreateHealthCertificateInput,
  CreateEuthanasiaInput,
  CreateConsentSurgeryInput,
  CreateClinicalSheetInput,
  CreateBillInput,
} from './dto/input';
import { Response } from 'express';
import { calcAgePet } from './utils/calc/calc-age.utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument1 = require(`pdfkit-table`);

//cabeceras de los documentos
import { addHeaderConstanciaSalud } from './headers/header-constancia-salud';
import { addHeaderEutanasia } from './headers/header-eutanasia';
import { addHeaderConsentimiento } from './headers/header-consentimiento';
import { addHeaderHojaClinica } from './headers/header-hoja-clinica';
import { addHeaderFactura } from './headers/headers-factura';
//cuerpo del documento
import { addFieldsConstanciaSalud } from './body/body-constancia-salud';
import { addFieldsEutanasia } from './body/body-eutanasia';
import { addFieldsConsentimiento } from './body/body-consentimiento';
import { addFieldsHojaClinica } from './body/body-hoja-clinica';
import { addFieldsFactura } from './body/body-factura';
//pie de pagina
import { finalTextConstanciaDeSalud } from './footer/footer-constancia-salud';
import { finalTextEutanasia } from './footer/footer-eutanasia';
import { finalTextConsentimiento } from './footer/footer-consentimiento';
import { LogoImageName } from './utils/fonts/fonts.style';
import { FilesService } from '../files/files.service';

@Injectable()
export class GeneratePdfService {
  private readonly logger = new Logger(GeneratePdfService.name);

  constructor(
    private readonly petsService: PetsService,
    private readonly billsService: BillsService,
    private readonly filesService: FilesService,
  ) {}

  async generatePDFHealthCertificate(
    id: number,
    createHealthCertificateInput: CreateHealthCertificateInput,
    res: Response,
  ): Promise<void> {
    this.logger.log(`Create PDF - Constancia de Salud`);

    const [dataPet, lastWeightPet, urlImageLogo] = await Promise.all([
      this.petsService.findOnePetById(id),
      this.petsService.getLastWeightPet(id),
      this.filesService.getLogosFiles(LogoImageName.logo),
    ]);

    const agePet = calcAgePet(dataPet.birthday.toString());
    //genera la estructura base del pdf, formato y demas
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument1({
        size: [612, 792], // Tamaño de página carta (8.5 x 11 pulgadas)
        bufferPages: true,
        margin: { top: 50, right: 50, bottom: 50, left: 50 }, // Márgenes
      });

      // Contiene el contenido final del documento PDF
      const buffer: Buffer[] = [];

      // Función para agregar encabezado en la primera página
      await addHeaderConstanciaSalud(doc, urlImageLogo);

      doc.moveDown();
      doc.text(`CONSTANCIA DE SALUD MÉDICA DE LA MASCOTA`, {
        align: `center`,
      });
      doc.moveDown(2);

      addFieldsConstanciaSalud(
        dataPet,
        createHealthCertificateInput,
        doc,
        lastWeightPet,
        agePet,
      );
      // Crear la tabla con filas dinámicas

      doc.on(`data`, buffer.push.bind(buffer));
      doc.on(`end`, () => {
        const pdfData = Buffer.concat(buffer);
        resolve(pdfData);
      });

      // Pie de pagina
      finalTextConstanciaDeSalud(doc, createHealthCertificateInput);

      doc.end();
    });

    formatDocument(
      pdfBuffer,
      res,
      dataPet,
      identifierFileName.healthCertification,
    );

    // Envía el PDF como respuesta
    res.end();
  }

  async generatePDFEuthanasia(
    idPet: number,
    res: Response,
    createEuthanasiaInput?: CreateEuthanasiaInput,
  ): Promise<void> {
    this.logger.log(`Create PDF Eutanasia`);

    const [dataPet, lastWeightPet, urlLogoImage] = await Promise.all([
      this.petsService.findOnePetById(idPet),
      this.petsService.getLastWeightPet(idPet),
      this.filesService.getLogosFiles(LogoImageName.logo),
    ]);

    const edadPet = calcAgePet(dataPet.birthday.toString());

    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument1({
        size: [612, 792],
        bufferPages: true,
        autoFirstPage: true,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
      });

      // Contiene el contenido final del documento PDF
      const buffer: Buffer[] = [];

      // Función para agregar encabezado en la primera página
      await addHeaderEutanasia(doc, urlLogoImage);

      addFieldsEutanasia(
        dataPet,
        createEuthanasiaInput,
        doc,
        lastWeightPet,
        edadPet,
      );

      doc.on(`data`, buffer.push.bind(buffer));
      doc.on(`end`, () => {
        const pdfData = Buffer.concat(buffer);
        resolve(pdfData);
      });

      finalTextEutanasia(doc);
      doc.end();
    });

    formatDocument(pdfBuffer, res, dataPet, identifierFileName.euthanasia);

    // Envía el PDF como respuesta
    res.end();
  }

  async generatePDFConsentSurgery(
    idPet: number,
    createConsentSurgeryInput: CreateConsentSurgeryInput,
    res: Response,
  ) {
    this.logger.log(`Create PDF Consentimiento de anestecia y cirugia `);

    const [dataPet, urlLogoImage] = await Promise.all([
      this.petsService.findOnePetById(idPet),
      this.filesService.getLogosFiles(LogoImageName.logo),
    ]);
    const edadPet = calcAgePet(dataPet.birthday.toString());

    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument1({
        size: [612, 792],
        bufferPages: true,
        autoFirstPage: true,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
      });
      // Contiene el contenido final del documento PDF en formato buffer
      const buffer: Buffer[] = [];

      // Función para agregar encabezado en la primera página
      await addHeaderConsentimiento(doc, urlLogoImage);

      addFieldsConsentimiento(dataPet, createConsentSurgeryInput, doc, edadPet);

      doc.on(`data`, buffer.push.bind(buffer));
      doc.on(`end`, () => {
        const pdfData = Buffer.concat(buffer);
        resolve(pdfData);
      });

      finalTextConsentimiento(doc);

      doc.end();
    });

    formatDocument(pdfBuffer, res, dataPet, identifierFileName.consentSurgery);

    // Envía el PDF como respuesta
    res.end();
  }

  async generatePDFClinicalSheet(
    idPet: number,
    createClinicalSheetInput: CreateClinicalSheetInput,
    res: Response,
    medicalHistoryId: number,
  ) {
    this.logger.log(`Create PDF Hoja Clinica`);

    const [dataPet, dataMedicalHistory, lastWeightPet, urlLogoImage] =
      await Promise.all([
        this.petsService.findOnePetById(idPet),
        this.petsService.findOneMedicalHistoryById(medicalHistoryId),
        this.petsService.getLastWeightPet(idPet),
        this.filesService.getLogosFiles(LogoImageName.logo),
      ]);

    const edadPet = calcAgePet(dataPet.birthday.toString());

    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument1({
        size: [612, 792],
        bufferPages: true,
        autoFirstPage: true,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
      });
      const buffer = [] as Buffer[];

      await addHeaderHojaClinica(doc, urlLogoImage, medicalHistoryId);
      addFieldsHojaClinica(
        dataPet,
        createClinicalSheetInput,
        doc,
        lastWeightPet,
        edadPet,
        dataMedicalHistory,
      );

      doc.on(`data`, buffer.push.bind(buffer));
      doc.on(`end`, () => {
        const pdfData = Buffer.concat(buffer);
        resolve(pdfData);
      });

      doc.end();
    });

    formatDocument(pdfBuffer, res, dataPet, identifierFileName.clinicalSheet);

    // Envía el PDF como respuesta
    res.end();
  }

  async generatePDFFacturaCliente(
    billsId: number,
    res: Response,
    createBillInput: CreateBillInput,
  ) {
    this.logger.log(`Create PDF Factura Cliente`);

    const [dataBill, urlImageLogo] = await Promise.all([
      this.billsService.findOne(billsId),
      this.filesService.getLogosFiles(LogoImageName.logoWithName),
    ]);

    const { createdAt, id } = dataBill;

    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument1({
        size: [612, 792],
        bufferPages: true,
        autoFirstPage: true,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
      });
      const buffer = [] as Buffer[];

      await addHeaderFactura(doc, createdAt, id, urlImageLogo);

      addFieldsFactura(dataBill, doc, createBillInput);

      doc.on(`data`, buffer.push.bind(buffer));
      doc.on(`end`, () => {
        const pdfData = Buffer.concat(buffer);
        resolve(pdfData);
      });

      doc.end();
    });
    formatDocumentBill(pdfBuffer, res);

    // Envía el PDF como respuesta
    res.end();
  }
}
