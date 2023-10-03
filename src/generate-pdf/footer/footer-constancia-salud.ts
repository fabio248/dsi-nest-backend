import { CreateConstanciaSaludInput } from '../dto/input/create-constancia.input';
//fonts
import {
  MerriweatherBlack,
  MerriweatherLight,
} from '../utils/fonts/fonts.style';

export async function finalTextConstanciaDeSalud(
  doc: any,
  createDocumentInput: CreateConstanciaSaludInput,
) {
  // Establece el formato de fuente igual al de addFields
  doc.font(MerriweatherBlack);
  doc.fontSize(11); // Tamaño de fuente más pequeño

  doc.moveDown();
  doc
    .font(MerriweatherBlack)
    .text(
      'Estando así sus vacunas vigentes, y para los usos que el interesado estime conveniente ejemplar se encuentra apto para su traslado' +
        `por vía aérea, marítima o terrestre. Por lo que se extiende la presente constancia en Zacatecoluca, La Paz, el día: `,
      {
        continued: true,
        align: 'left',
      },
    );

  const dateExpedition = `${createDocumentInput.dateJourney}`;

  doc.font(MerriweatherLight).text(dateExpedition, {
    align: 'left',
  });
  doc.moveDown(1);
  // Agrega la línea y el texto adicional
  doc.text('F.___________________________', { align: 'center' });
  doc.text('MVZ. Saúl Antonio Medina Matus', { align: 'center' });
  doc.text('J.V.M.V Nº 570', { align: 'center' });
}
