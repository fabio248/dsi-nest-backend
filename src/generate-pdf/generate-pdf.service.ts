import { Injectable, Logger } from '@nestjs/common';
import { formatDocument } from './conditions-format/conditions-format-constancia-salud';
import { PetsService } from 'src/pets/pets.service';
import { CreateDocumentInput } from './dto/input/create-constancia.input';
import { Response } from 'express';
//libreria de generacion de pdf
const PDFDocument1 = require(`pdfkit-table`);

//cabeceras de los documentos
import { addHeader } from './headers/header-constancia-salud';
//cuerpo del documento
import { addFields } from './body/body-constancia-salud';
//pie de pagina
import { finalText } from './footer/footer-constancia-salud';

//fonts
import { MerriweatherLight } from './utils/fonts/fonts.style';

@Injectable()
export class GeneratePdfService {
  private readonly logger = new Logger(GeneratePdfService.name);

  constructor(private readonly petsService: PetsService) {}

  async generaPDFContanciaSalud(
    id: number,
    createDocumentInput: CreateDocumentInput,
    res: Response,
  ): Promise<void> {
    this.logger.log(`Create PDF`);

    const dataPet = await this.petsService.findOneById(id);

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
      const headers = addHeader(doc);

      doc.moveDown();
      doc.text(`CONSTANCIA DE SALUD MÉDICA DE LA MASCOTA`, {
        width: doc.page.width - 100,
        align: `center`,
      });
      doc.moveDown(2);

      const body = addFields(dataPet, createDocumentInput, doc);

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
      const footer = finalText(doc, createDocumentInput);
      footer;
      doc.end();
    });

    const responsePDF = formatDocument(pdfBuffer, res);

    // Envía el PDF como respuesta
    res.end(responsePDF);
  }
}
