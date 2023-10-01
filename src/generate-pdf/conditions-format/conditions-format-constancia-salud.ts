import { Response } from 'express';
export function formatDocument(pdfBuffer: Buffer, res: Response) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=ConstanciaDeSalud.pdf',
  );
  res.setHeader('Content-Length', pdfBuffer.length);

  res.send(pdfBuffer);
}
