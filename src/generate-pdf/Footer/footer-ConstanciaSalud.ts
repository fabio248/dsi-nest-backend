import { CreateDocumentInput } from '../dto/input/create-constancia.input';

export async function finalText(
  doc: any,
  createDocumentInput: CreateDocumentInput,
) {
  // Establece el formato de fuente igual al de addFields
  doc.font(`Public/Fonts/Merriweather-Black.ttf`);
  doc.fontSize(11); // Tamaño de fuente más pequeño

  doc.moveDown();
  doc
    .font(`Public/Fonts/Merriweather-Black.ttf`)
    .text(
      'Estando así sus vacunas vigentes, y para los usos que el interesado estime conveniente ejemplar se encuentra apto para su traslado' +
        `por vía aérea, marítima o terrestre. Por lo que se extiende la presente constancia en Zacatecoluca, La Paz, el día: `,
      {
        continued: true,
        align: 'left',
      },
    );

  const dateExpedition = `${createDocumentInput.dateJourney}`;

  doc.font(`Public/Fonts/Merriweather-Light.ttf`).text(dateExpedition, {
    align: 'left',
  });
  doc.moveDown(1);
  // Agrega la línea y el texto adicional
  doc.text('F.___________________________', { align: 'center' });
  doc.text('MVZ. Saúl Antonio Medina Matus', { align: 'center' });
  doc.text('J.V.M.V Nº 570', { align: 'center' });
}
