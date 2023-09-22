import { Injectable, Logger } from '@nestjs/common';
import { formatDocument } from './ConditionsFormat/formatedPdf';
import { join } from 'path';
const PDFDocument1 = require('pdfkit-table');

@Injectable()
export class GeneratePdfService {
  // Identificacion del logger para el metodo de la clase
  private readonly logger = new Logger(GeneratePdfService.name);

  async generatePDF(id: number, res: any): Promise<void> {
    this.logger.log('Create PDF');

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument1({
        size: 'LETTER',
        bufferPages: true,
        // le decimos que la primera pag no sea por defecto
        autoFirstPage: false,
      });

      let pageNumber = 0;
      // agregar paginacion y encabezado
      doc.on('pagedAdded', () => {
        pageNumber++;
        if (pageNumber > 1) {
          doc.image(
            join(process.cwd(), 'Public/logo.png'),
            doc.page.width - 100,
            5,
            { fit: [45, 45], align: 'center' },
          );
          doc
            .moveTo(50, 55)
            .lineTo(doc.page.width - 50, 55)
            .stroke();
        }

        let bottom = doc.page.margins.bottom;

        doc.page.margins.bottom = 0;
        doc.text(
          'Pag. ' + pageNumber,
          (doc.page.width - 100) * 0.5,
          doc.page.height - 50,
          {
            width: 100,
            align: 'center',
            lineBreak: false,
          },
        );
        doc.page.margings.bottom = bottom;
      });
      doc.addPage();
      doc.addPage();
      doc.image(
        join(process.cwd(), 'Public/logo.png'),
        doc.page.width / 2 - 100,
        150,
        { width: 200 },
      );
      doc.text('', 0, 400);
      doc.font('Helvetica-Bold').fontSize(24);
      doc.text('DEV LATAM ', {
        width: doc.page.width,
        align: 'center',
      });

      const table = {
        title: 'Tabla de datos',
        subtittle: 'Subtitulo de la tabla',
        headers: ['id', 'nombre'],
        rows: [
          ['1', 'Gutierrez'],
          ['2', 'Francisco'],
        ],
      };

      doc.table(table, { columnSize: [150, 300] });
      doc.text('Hello world!', 100, 100);
      doc.moveDown();
      doc.text('ASI QUEDARÁ EL PDF ME FALTA ESTILO');

      //contiene el contenido final del documento pdf
      const buffer = [] as Buffer[];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffer);
        resolve(pdfData);
      });

      doc.end();
    });
    const responsePDF = formatDocument(pdfBuffer, res);

    // Envía el PDF como respuesta
    res.end(responsePDF);
  }
}
