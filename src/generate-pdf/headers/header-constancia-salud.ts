import { MerriweatherBlack } from '../utils/fonts/fonts.style';
import { getBufferImage } from '../utils/get-file-logo.utils';

export async function addHeaderConstanciaSalud(doc: any, urlImageLogo: string) {
  // Agrega el texto del encabezado agrupado
  doc.font(MerriweatherBlack).text(`Clínica Veterinaria Mistun.`, 50, 40, {
    width: doc.page.width - 100,
    align: `center`,
  });
  doc
    .font(MerriweatherBlack)
    .text(
      `Barrio Santa Lucía, Casa #23, sobre 1° Av. Norte, Zacatecoluca, La Paz.`,
      50,
      doc.y,
      {
        width: doc.page.width - 100,
        align: `left`,
      },
    );

  doc.font(MerriweatherBlack).text(`Saulvet99@gmail.com`, 50, doc.y, {
    width: doc.page.width - 100,
    align: `left`,
  });

  doc
    .font(MerriweatherBlack)
    .text(`Teléfono 6136-6565; 2200-3554.`, 50, doc.y, {
      width: doc.page.width - 100,
      align: `left`,
    });

  const logoBuffer = await getBufferImage(urlImageLogo);
  // Imagen en el lado derecho del encabezado
  doc.image(
    logoBuffer,
    doc.page.width - 100,
    35, // Ajusta la posición vertical para que esté al mismo nivel que el texto
    { fit: [80, 65], align: `left` },
    23,
  );

  // Línea horizontal debajo del encabezado
  doc
    .moveTo(50, 108) // Ajusta la posición vertical
    .lineTo(doc.page.width - 50, 108) // Ajusta la posición vertical
    .stroke();

  // Espacio vertical entre elementos
  doc.moveDown(1);
}
