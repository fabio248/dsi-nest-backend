import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument1 = require('pdfkit');
// import { plainToInstance } from 'class-transformer';

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
      });

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
    // const PDF = this.formatDocument(pdfBuffer);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=filename.pdf');
    res.setHeader('Content-Length', pdfBuffer.length);

    // Envía el PDF como respuesta
    res.end(pdfBuffer);
    // return plainToInstance(Buffer, pdfBuffer);
  }

  //   formatDocument(pdfBuffer: Buffer) {
  //     const data = '';
  //     data.set({
  //       'Content-type': 'application/pdf',
  //       'Content-Disposition': 'attachment; filename=filename.pdf',
  //       'Content-Length': pdfBuffer.length,
  //     });
  //     return data
  //   }
}
