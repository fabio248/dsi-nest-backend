import { Injectable, Logger } from '@nestjs/common';
import { formatDocument } from './ConditionsFormat/formatedPdf';
import { join } from 'path';
const PDFDocument1 = require('pdfkit-table');

@Injectable()
export class GeneratePdfService {
  private readonly logger = new Logger(GeneratePdfService.name);

  async generatePDF(id: number, res: any): Promise<void> {
    this.logger.log('Create PDF');

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument1({
        size: 'LETTER',
        bufferPages: true,
        autoFirstPage: true, // Hacer que la primera página se agregue automáticamente
      });

      // Contiene el contenido final del documento PDF
      const buffer = [] as Buffer[];

      // Espacio vertical entre elementos
      const verticalSpacing = 5;

      // Función para agregar encabezado en la primera página
      const addHeader = () => {
        // Agrega "Veterinaria Mistun" a la izquierda del documento y al mismo nivel
        doc.text('Veterinaria Mistun', 60, 65, {
          width: doc.page.width - 250, // Ajusta la posición horizontal según sea necesario
          align: 'left', // Alinea el texto a la izquierda
        });

        // Imagen en el lado derecho del encabezado
        doc.image(
          join(process.cwd(), 'Public/logo.png'),
          doc.page.width - 100,
          33, // Ajusta la posición vertical para que esté al mismo nivel que el texto
          { fit: [45, 45], align: 'center' },
        );

        // Línea horizontal debajo del encabezado
        doc
          .moveTo(50, 80) // Ajusta la posición vertical
          .lineTo(doc.page.width - 50, 80) // Ajusta la posición vertical
          .stroke();

        // Espacio vertical entre elementos
        doc.moveDown(verticalSpacing);
      };

      // Función para agregar los campos solicitados
      const addFields = () => {
        // Alinea "Nombre:" y agrega la variable cambiante
        doc.text('Nombre: {variable cambiante}', { continued: true });
        doc.moveDown(); // Salto de línea
        // Alinea "Especie:"
        doc.text('Especie:', { continued: true });
        doc.moveDown(); // Salto de línea
        // Alinea "Raza:"
        doc.text('Raza:', { continued: true });
        doc.moveDown(); // Salto de línea
        // Alinea "Sexo:"
        doc.text('Sexo:', { continued: true });
        doc.moveDown(); // Salto de línea
        // Alinea "Edad:"
        doc.text('Edad:', { continued: true });
        doc.moveDown(); // Salto de línea
        // Alinea "Peso:"
        doc.text('Peso:', { continued: true });
        doc.moveDown(); // Salto de línea
        // Alinea "Fecha de Nacimiento:"
        doc.text('Fecha de Nacimiento:', { continued: true });
        doc.moveDown(); // Salto de línea
        // Alinea "Identificación del microchip:"
        doc.text('Identificación del microchip:');
      };

      // Manejo de eventos para recopilar el contenido del PDF
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffer);
        resolve(pdfData);
      });

      // Contenido del PDF, como logo y texto
      addHeader();

      // Alinea "Constancia de Salud" al centro
      doc.text('Constancia de Salud', {
        width: doc.page.width - 100,
        align: 'center',
      });

      // Agrega los campos sin espacio adicional
      addFields();

      const table = {
        title: 'Tabla de datos',
        subtitle: 'Subtítulo de la tabla',
        headers: ['ID', 'Nombre'],
        rows: [
          ['1', 'Gutierrez'],
          ['2', 'Francisco'],
        ],
      };

      doc.table(table, { columnSize: [150, 300] });

      doc.end();
    });

    const responsePDF = formatDocument(pdfBuffer, res);

    // Envía el PDF como respuesta
    res.end(responsePDF);
  }
}
