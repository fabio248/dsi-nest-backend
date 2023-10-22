import { Response } from 'express';
import { PetResponseDto } from 'src/pets/dto/response';

//formato para constancia de salud
export function formatDocument(
  pdfBuffer: Buffer,
  res: Response,
  dataPet: PetResponseDto,
  idFile: number,
) {
  const idToFileNameMap = [
    `ConstanciaDeSalud-Mascota_${dataPet.name}.pdf`,
    `Eutanasia_${dataPet.name}-Propietario_${dataPet.user.firstName}.pdf`,
    `ConsentimientoDeCirugiaYAnestecia_${dataPet.name}.pdf`,
    `HojaClinica-Mascota_${dataPet.name}.pdf`,
    ``,
  ];

  const filename = idToFileNameMap[idFile] || 'ArchivoDesconocido.pdf';

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Length', pdfBuffer.length);

  res.send(pdfBuffer);
}

export function formatDocumentBill(pdfBuffer: Buffer, res: Response) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=FacturaDelCliente_.pdf`,
  );
  res.setHeader('Content-Length', pdfBuffer.length);

  res.send(pdfBuffer);
}

export const identifierFileName = {
  healthCertification: 0,
  euthanasia: 1,
  consentSurgery: 2,
  clinicalSheet: 3,
} as const;
