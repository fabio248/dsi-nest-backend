/* eslint-disable prettier/prettier */
import { UserResponseDto } from '../../users/dto/response/user.response';
import { formatTable } from '../utils/calc/utils-calc-tableFormat';
//format to table
import { PDFDocument } from 'pdf-lib';
type TableFunction = (doc: PDFDocument) => void;
//fonts
import {
  //   MerriweatherLight,
  MerriweatherBlack,
  MerriweatherLight,
} from '../utils/fonts/fonts.style';

export function addFieldsFactura(dataUser: UserResponseDto, doc: any) {
  doc.fontSize(12); // Tamaño de fuente más pequeño
  doc.moveDown();
  doc.font(MerriweatherBlack).text('DATOS DEL CLIENTE ', {
    align: 'center',
  });
  // Añade espacio vertical entre el texto anterior y la tabla
  doc.moveDown(1);

  // Cliente
  doc.font(MerriweatherBlack).text(`Cliente: `, {
    continued: true,
    align: 'left',
  });

  doc
    .font(MerriweatherLight)
    .text(`${dataUser.firstName}` + ' ' + `${dataUser.lastName}`, {
      align: 'left',
    });
  doc.moveDown(1);

  // Direccion
  doc.font(MerriweatherBlack).text(`Dirección: `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(
      dataUser.direction
        ? `${dataUser.direction}`
        : 'No se proporcionó una dirección',
      {
        align: 'left',
      },
    );
  doc.moveDown(0.7);

  // Venta a cuenta de
  doc.font(MerriweatherBlack).text(`Venta a cuenta de: `, {
    continued: true,
    align: 'left',
  });

  doc
    .font(MerriweatherLight)
    .text('Inserte numero de cuenta', {
      continued: true,
      align: 'left',
    })
    .text('       ', {
      continued: true,
    })
    .font(MerriweatherBlack)
    .text('DUI: ', {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherLight)
    .text(dataUser.dui)
    .moveDown(2);

  const talbleFacture = {
    title: `Registro de su compra :`,
    headers: [
      `CANT.`,
      `DESCRIPCIÓN`,
      `PRECIO UNITARIO`,
      `VENTAS EXENTAS`,
      `VENTAS NO SUJETAS`,
      `VENTAS GRAVADAS`,
    ],
    rows: [] as string[] /*as CreateVaccineHojaClinicaPetInput[]*/,
  };

  //asignacion dinámica
  // for (let i = 0; i < createHojaClinicaInput.vaccines.length; i++) {
  //   const row2 = [
  //     createHojaClinicaInput.vaccines[i].dayAplicationInit,
  //     createHojaClinicaInput.vaccines[i].vaccineName,
  //     createHojaClinicaInput.vaccines[i].dayAplicationfinal,
  //   ];
  //   tableVaccines.rows.push(
  //     row2 as unknown as CreateVaccineHojaClinicaPetInput,
  //   );
  // }

  //mismo proceso mandamos la carga de codigo del formato de la tabla a Utils/Calc/utils-calc-tableFormat
  const tableVaccinesFormat = formatTable(
    doc,
    talbleFacture as unknown as TableFunction,
  );
  //renderizamos el contenido de la funcion
  tableVaccinesFormat;
  doc.moveDown(0.5);
}
