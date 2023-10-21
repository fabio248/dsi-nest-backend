import { MerriweatherBlack } from '../utils/fonts/fonts.style';

export async function finalTextEutanasia(doc: any) {
  // Establece el formato de fuente igual al de addFields
  doc.font(MerriweatherBlack);
  doc.fontSize(11); // Tamaño de fuente más pequeño

  doc.moveDown(3);
  // Agrega la línea y el texto adicional
  doc.text('F.___________________________', { align: 'center' });
  doc.text('Firma del Propietario o Responsable ', { align: 'center' });
}
