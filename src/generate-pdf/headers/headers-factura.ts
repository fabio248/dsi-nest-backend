import {
  MerriweatherBlack,
  Times_New_Roman_Bold_Italic,
  MerriweatherLight,
} from '../utils/fonts/fonts.style';
import { getBufferImage } from '../utils/get-file-logo.utils';

export async function addHeaderFactura(
  doc: any,
  createdAt: Date,
  billNumber: number,
  urlImageLogo: string,
) {
  const informacionFactura = [
    { label: 'SERIE', value: '23DS000F' },
    { label: 'REGISTRO N°', value: '270351-2' },
    { label: 'NIT', value: '0614-171184-102-9' },
    { label: 'DUI', value: '02524874-6' },
    { label: 'N°', value: `${String(billNumber).padStart(6, '0')}` },
  ];

  // Posición de la imagen y el cuadro
  const imagenX = 50; // Posición X de la imagen
  const imagenY = 50; // Posición Y de la imagen

  const cuadroAncho = 240; // Ancho del cuadro
  const cuadroAlto = 100; // Alto del cuadro
  const cuadroX = doc.page.width - cuadroAncho - 50; // Posición X del cuadro
  const cuadroY = imagenY; // Posición Y del cuadro (alineado con la imagen)

  const bufferLogo = await getBufferImage(urlImageLogo);

  // Imagen en el lado izquierdo del encabezado
  doc.image(bufferLogo, imagenX, imagenY - 75, {
    fit: [230, 350],
    align: 'left',
    continued: true,
  });

  // Dibujar el cuadro
  doc.rect(cuadroX, cuadroY, cuadroAncho, cuadroAlto).stroke();

  // Información de la factura
  doc.font(MerriweatherBlack).fontSize(12).fillColor('black');

  informacionFactura.forEach((info, index) => {
    const yPos = cuadroY + 20 + index * 15; // Ajustar la posición vertical para cada línea
    doc
      .font(MerriweatherBlack)
      .text(info.label, cuadroX + 10, yPos, {
        align: 'left',
      })
      .font(MerriweatherLight) // Cambiar el tipo de letra a MerriweatherLight
      .text(info.value, cuadroX + 100, yPos, {
        align: 'left',
      });
  });
  doc.moveDown(0.7);
  // Añadir la fecha
  doc
    .font(Times_New_Roman_Bold_Italic)
    .fontSize(12)
    .text('Dr. Saul Antonio Medina Matus', 50, doc.y, {
      width: doc.page.width - 100,
      align: 'left',
      continued: true,
    })
    .font(MerriweatherBlack)
    .text(`Fecha: ${createdAt}`, {
      align: 'right',
    });

  doc
    .font(MerriweatherBlack)
    .text(`Barrio Santa Lucía, Casa #23`, 50, doc.y, {
      width: doc.page.width - 100,
      align: 'left',
    })
    .text('sobre 1° Av. Norte, Zacatecoluca, La Paz', {
      align: 'left',
    });

  doc
    .font(MerriweatherBlack)
    .text('Correo: ', {
      width: doc.page.width - 100,
      continued: true,
      align: 'left',
    })
    .font(MerriweatherLight)
    .text('Saulvet99@gmail.com ');
  doc.moveDown(1);
}
