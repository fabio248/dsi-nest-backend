/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import {
  formatDocument,
  formatDocumentFactura,
} from './conditions-format/conditions-format-constancia-salud';
import { PetsService } from 'src/pets/pets.service';
import { UsersService } from 'src/users/users.service';
import { CreateConstanciaSaludInput } from './dto/input/create-constancia.input';
import { CreateEutanasiaInput } from './dto/input/create-eutanasia.input';
import { CreateConsentimientoInput } from './dto/input/create-consentimiento.input';
import { CreateHojaClinicaInput } from './dto/input/create-hoja-clinica.input';
import { Response } from 'express';
import { CalcAgePet } from './utils/calc/utils-calc-age';

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

@Injectable()
export class GeneratePdfService {
  private readonly logger = new Logger(GeneratePdfService.name);

  constructor(
    private readonly petsService: PetsService,
    // @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async generaPDFContanciaSalud(
    id: number,
    createDocumentInput: CreateConstanciaSaludInput,
    res: Response,
  ): Promise<void> {
    this.logger.log(`Create PDF - Constancia de Salud`);

    const dataPet = await this.petsService.findOnePetById(id);

    const LastWeightPet = await this.petsService.getLastWeightPet(id);

    const agePet = CalcAgePet(dataPet.birthday.toString());
    //genera la estructura base del pdf, formato y demas
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument1({
        size: [612, 792], // Tamaño de página carta (8.5 x 11 pulgadas)
        bufferPages: true,
        autoFirstPage: true, // Hacer que la primera página se agregue automáticamente
        margin: { top: 50, right: 50, bottom: 50, left: 50 }, // Márgenes
      });

      // Contiene el contenido final del documento PDF
      const buffer = [] as Buffer[];

      // Función para agregar encabezado en la primera página
      const headers = addHeaderConstanciaSalud(doc);

      doc.moveDown();
      doc.text(`CONSTANCIA DE SALUD MÉDICA DE LA MASCOTA`, {
        // width: doc.page.width - 100,
        align: `center`,
      });
      doc.moveDown(2);

      const body = addFieldsConstanciaSalud(
        dataPet,
        createDocumentInput,
        doc,
        LastWeightPet,
        agePet,
      );
      // Crear la tabla con filas dinámicas

      doc.on(`data`, buffer.push.bind(buffer));
      doc.on(`end`, () => {
        const pdfData = Buffer.concat(buffer);
        resolve(pdfData);
      });

      // Contenido del PDF, como logo y texto
      headers;

      //contenido del PDF, cuerpo renderizado del documento
      body;

      // Pie de pagina
      const footer = finalTextConstanciaDeSalud(doc, createDocumentInput);
      footer;
      doc.end();
    });

    const responsePDF = formatDocument(pdfBuffer, res, dataPet, 0);

    // Envía el PDF como respuesta
    res.end(responsePDF);
  }

  async generatePDFEutanasia(
    idPet: number,
    createEutanasiaInput: CreateEutanasiaInput,
    res: Response,
  ): Promise<void> {
    this.logger.log(`Create PDF Eutanasia`);

    const dataPet = await this.petsService.findOnePetById(idPet);

    const edadPet = CalcAgePet(dataPet.birthday.toString());

    const lastWeightPet = await this.petsService.getLastWeightPet(idPet);
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument1({
        size: [612, 792],
        bufferPages: true,
        autoFirstPage: true,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
      });

      // Contiene el contenido final del documento PDF
      const buffer = [] as Buffer[];

      // Función para agregar encabezado en la primera página
      const headersEutanasia = addHeaderEutanasia(doc);

      const bodyEutanasia = addFieldsEutanasia(
        dataPet,
        createEutanasiaInput,
        doc,
        lastWeightPet,
        edadPet,
      );

      doc.on(`data`, buffer.push.bind(buffer));
      doc.on(`end`, () => {
        const pdfData = Buffer.concat(buffer);
        resolve(pdfData);
      });

      headersEutanasia;

      bodyEutanasia;

      const footerEutanasia = finalTextEutanasia(doc);
      footerEutanasia;
      doc.end();
    });

    const responsePDF = formatDocument(pdfBuffer, res, dataPet, 1);

    // Envía el PDF como respuesta
    res.end(responsePDF);
  }

  async generatePDFConsentimiento(
    idPet: number,
    createConsentimientoInput: CreateConsentimientoInput,
    res: Response,
  ) {
    this.logger.log(`Create PDF Consentimiento de anestecia y cirugia `);

    const dataPet = await this.petsService.findOnePetById(idPet);

    const edadPet = CalcAgePet(dataPet.birthday.toString());

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument1({
        size: [612, 792],
        bufferPages: true,
        autoFirstPage: true,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
      });
      // Contiene el contenido final del documento PDF en formato buffer
      const buffer = [] as Buffer[];

      // Función para agregar encabezado en la primera página
      const headersEutanasia = addHeaderConsentimiento(doc);

      const bodyEutanasia = addFieldsConsentimiento(
        dataPet,
        createConsentimientoInput,
        doc,
        edadPet,
      );

      doc.on(`data`, buffer.push.bind(buffer));
      doc.on(`end`, () => {
        const pdfData = Buffer.concat(buffer);
        resolve(pdfData);
      });

      headersEutanasia;

      bodyEutanasia;

      const footerConsentimiento = finalTextConsentimiento(doc);
      footerConsentimiento;
      doc.end();
    });

    const responsePDF = formatDocument(pdfBuffer, res, dataPet, 2);

    // Envía el PDF como respuesta
    res.end(responsePDF);
  }

  async generatePDFHojaClinica(
    idPet: number,
    createHojaClinicaInput: CreateHojaClinicaInput,
    res: Response,
    medicalHistoryId: number,
  ) {
    this.logger.log(`Create PDF Hoja Clinica`);

    const dataPet = await this.petsService.findOnePetById(idPet);

    const dataMedicalHistory = await this.petsService.findOneMedicalHistoryById(
      medicalHistoryId,
    );

    const edadPet = CalcAgePet(dataPet.birthday.toString());

    const lastWeightPet = await this.petsService.getLastWeightPet(idPet);

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument1({
        size: [612, 792],
        bufferPages: true,
        autoFirstPage: true,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
      });
      const buffer = [] as Buffer[];

      const headersEutanasia = addHeaderHojaClinica(
        doc,
        createHojaClinicaInput,
      );
      const bodyHojaClinica = addFieldsHojaClinica(
        dataPet,
        createHojaClinicaInput,
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

      headersEutanasia;

      bodyHojaClinica;

      doc.end();
    });

    const responsePDF = formatDocument(pdfBuffer, res, dataPet, 3);

    // Envía el PDF como respuesta
    res.end(responsePDF);
  }

  async generatePDFFacturaCliente(idClient: number, res: Response) {
    this.logger.log(`Create PDF Factura Cliente`);

    const dataUser = await this.userService.findOneById(idClient);

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument1({
        size: [612, 792],
        bufferPages: true,
        autoFirstPage: true,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
      });
      const buffer = [] as Buffer[];

      const headersFactura = addHeaderFactura(doc);

      const bodyFactura = addFieldsFactura(dataUser, doc);

      doc.on(`data`, buffer.push.bind(buffer));
      doc.on(`end`, () => {
        const pdfData = Buffer.concat(buffer);
        resolve(pdfData);
      });

      headersFactura;

      bodyFactura;

      doc.end();
    });
    const responsePDF = formatDocumentFactura(pdfBuffer, res);

    // Envía el PDF como respuesta
    res.end(responsePDF);
  }
}
