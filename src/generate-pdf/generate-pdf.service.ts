/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { formatDocument } from './conditions-format/conditions-format-constancia-salud';
import { PetsService } from 'src/pets/pets.service';
import { CreateConstanciaSaludInput } from './dto/input/create-constancia.input';
import { CreateEutanasiaInput } from './dto/input/create-eutanasia.input';

import { Response } from 'express';
//libreria de generacion de pdf "pdfkit-table"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument1 = require(`pdfkit-table`);

//cabeceras de los documentos
import { addHeaderConstanciaSalud } from './headers/header-constancia-salud';
import { addHeaderEutanasia } from './headers/header-eutanasia';
//cuerpo del documento
import { addFields } from './body/body-constancia-salud';
import { addFieldsEutanasia } from './body/body-eutanasia';
//pie de pagina
import { finalTextConstanciaDeSalud } from './footer/footer-constancia-salud';
import { finalTextEutanasia } from './footer/footer-eutanasia';

//fonts
import {
  // MerriweatherBlack,
  MerriweatherLight,
} from './utils/fonts/fonts.style';

@Injectable()
export class GeneratePdfService {
  private readonly logger = new Logger(GeneratePdfService.name);

  constructor(private readonly petsService: PetsService) {}

  async generaPDFContanciaSalud(
    id: number,
    createDocumentInput: CreateConstanciaSaludInput,
    res: Response,
  ): Promise<void> {
    this.logger.log(`Create PDF - Constancia de Salud`);

    const dataPet = await this.petsService.findOnePetById(id);

    const LastWeightPet = await this.petsService.getLastWeightPet(id);

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
        align: `left`,
      });
      doc.moveDown(2);

      const body = addFields(dataPet, createDocumentInput, doc, LastWeightPet);

      // Crear la tabla con filas dinámicas

      const table = {
        title: `VACUNAS:`,
        subtitle: `Registro de Vacunación de la mascota`,
        subtitleFontSize: 50,
        headers: [`Fecha de aplicación`, `Vacuna`, 'Marca y lote'],
        rows: [
          [
            `${createDocumentInput.vaccinesDate}`,
            `${createDocumentInput.vaccine}`,
            `${createDocumentInput.vaccinesBrandAndLot}`,
          ],
          [' ', ' ', ' '],
          [' ', ' ', ' '],
          [' ', ' ', ' '],
        ],
        widths: [150, 300],
        layout: 'lightHorizontalLines',
        fontSize: 52, // Aumentamos el tamaño de fuente a 16 aquí
        rowHeight: 40, // Ajusta la altura de la fila si es necesario
        font: MerriweatherLight, // Ruta a la fuente que deseas usar
      };

      doc.table(table, { columnSize: [150, 300] });

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

    const responsePDF = formatDocument(pdfBuffer, res);

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

    const responsePDF = formatDocument(pdfBuffer, res);

    // Envía el PDF como respuesta
    res.end(responsePDF);
  }
}
