/* eslint-disable prettier/prettier */
import { join } from 'path';
// const PDFDocument1 = require(`pdfkit-table`);

export function addHeader(doc: any) {
  // Agrega el texto del encabezado agrupado
  doc
    .font(`Public/Fonts/Merriweather-Black.ttf`)
    .text(`Clínica Veterinaria Mistun,`, 50, 40, {
      width: doc.page.width - 100,
      align: `left`,
    });

  doc
    .font(`Public/Fonts/Merriweather-Black.ttf`)
    .text(
      `Barrio Santa Lucía, Casa #23, sobre 1° Av. Norte, Zacatecoluca, La Paz.`,
      50,
      doc.y,
      {
        width: doc.page.width - 100,
        align: `left`,
      },
    );

  doc
    .font(`Public/Fonts/Merriweather-Black.ttf`)
    .text(`Saulvet99@gmail.com`, 50, doc.y, {
      width: doc.page.width - 100,
      align: `left`,
    });

  doc
    .font(`Public/Fonts/Merriweather-Black.ttf`)
    .text(`Teléfono 6136-6565; 2200-3554.`, 50, doc.y, {
      width: doc.page.width - 100,
      align: `left`,
    });

  // Imagen en el lado derecho del encabezado
  doc.image(
    join(process.cwd(), `Public/logo.png`),
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
