import { join } from 'path';
import { CreateHojaClinicaInput } from '../dto/input/create-hoja-clinica.input';

//fonts
import { MerriweatherBlack } from '../utils/fonts/fonts.style';

export function addHeaderHojaClinica(
  doc: any,
  createHojaClinicaInput: CreateHojaClinicaInput,
) {
  const DateNow = Date.now();
  const fecha = new Date(DateNow);

  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // Los meses se cuentan desde 0, por lo que sumamos 1
  const anio = fecha.getFullYear();

  const fechaFormateada = `${dia}/${mes}/${anio}`;
  // Agrega el texto del encabezado agrupado
  doc.font(MerriweatherBlack).text(`Clínica Veterinaria Mistun.`, 50, 40, {
    width: doc.page.width - 100,
    align: `center`,
  });
  doc.moveDown(0.1);
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

  doc.moveDown(1);

  doc.font(MerriweatherBlack).text(`Hoja Clínica N°: `, 50, doc.y, {
    continued: true,
    width: doc.page.width - 100,
    align: `left`,
  });

  doc.font(MerriweatherBlack).text(`${createHojaClinicaInput.clinicalNumber}`, {
    width: doc.page.width - 100,
    align: `left`,
  });

  doc
    .font(MerriweatherBlack)
    .text(`Documento Expedido: ${fechaFormateada}`, 50, doc.y, {
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
    .moveTo(50, 120) // Ajusta la posición vertical
    .lineTo(doc.page.width - 50, 120) // Ajusta la posición vertical
    .stroke();

  // Espacio vertical entre elementos
  doc.moveDown(1);
}
