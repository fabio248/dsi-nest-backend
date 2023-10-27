/* eslint-disable prettier/prettier */
import { BillResponse } from 'src/bills/dto/response/bill.response';
import { BillDetailsResponse } from 'src/bills/dto/response/bills-details.response';
import { CreateBillInput } from '../dto/input';
import { formatTable } from '../utils/calc/utils-calc-tableFormat';
import { FactureFormat } from '../utils/calc/utils-calc-factureFormat';
//format to table
import { PDFDocument } from 'pdf-lib';
type TableFunction = (doc: PDFDocument) => void;
//fonts
import {
  //   MerriweatherLight,
  MerriweatherBlack,
  MerriweatherLight,
} from '../utils/fonts/fonts.style';

export function addFieldsFactura(
  billsResponse: BillResponse,
  doc: any,
  createBillInput: CreateBillInput,
) {
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
    .text(
      `${billsResponse.client.firstName}` +
        ' ' +
        `${billsResponse.client.lastName}`,
      {
        align: 'left',
      },
    );
  doc.moveDown(1);

  // Direccion
  doc.font(MerriweatherBlack).text(`Dirección: `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(
      billsResponse.client.direction
        ? `${billsResponse.client.direction}`
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
    .text(
      createBillInput.accountToSale
        ? `${createBillInput.accountToSale}`
        : 'No se proporcionó una cuenta',
      {
        continued: true,
        align: 'left',
      },
    )
    .text('       ', {
      continued: true,
    })
    .font(MerriweatherBlack)
    .text('DUI: ', {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherLight)
    .text(billsResponse.client.dui)
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
    rows: [] as BillDetailsResponse[],
  };

  // asignacion dinámica
  for (let i = 0; i < billsResponse.billsDetails.length; i++) {
    const row2 = [
      billsResponse.billsDetails[i].quantity,
      billsResponse.billsDetails[i].description,
      '$' + billsResponse.billsDetails[i].unitPrice,
      billsResponse.billsDetails[i].exemptSales
        ? `${billsResponse.billsDetails[i].exemptSales}`
        : '       --',
      billsResponse.billsDetails[i].nonTaxableSales
        ? `${billsResponse.billsDetails[i].nonTaxableSales}`
        : '       --',
      '$' + billsResponse.billsDetails[i].taxableSales,
    ];
    talbleFacture.rows.push(row2 as unknown as BillDetailsResponse);
  }

  //mismo proceso mandamos la carga de codigo del formato de la tabla a Utils/Calc/utils-calc-tableFormat
  const tableVaccinesFormat = formatTable(
    doc,
    talbleFacture as unknown as TableFunction,
  );
  //renderizamos el contenido de la funcion
  tableVaccinesFormat;

  doc.moveDown(1);

  const additionalTableFacture = {
    headers: ['', ''],
    widths: [100, 100],
    rows: [
      ['VENTAS EXENTAS', ''],
      ['VENTAS NO SUJETAS', ''],
      ['SUB-TOTAL', ''],
      ['(-) IVA RETENIDO', '  --'],
      ['TOTAL', ''],
    ],
    align: 'right',
  };

  // Llenar la tabla con los valores correspondientes
  additionalTableFacture.rows[0][1] = billsResponse.billsDetails
    .reduce((total, item) => {
      return item?.exemptSales || '  --';
    }, 0)
    .toString();
  additionalTableFacture.rows[1][1] = billsResponse.billsDetails
    .reduce((total, item) => {
      return item?.nonTaxableSales || '  --';
    }, 0)
    .toString();
  additionalTableFacture.rows[2][1] = billsResponse.billsDetails
    .reduce((total, item) => {
      return total + (item.taxableSales || 0);
    }, 0)
    .toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  additionalTableFacture.rows[4][1] = billsResponse.totalSales.toLocaleString(
    'en-US',
    { style: 'currency', currency: 'USD' },
  );

  const additionalTableFactureFormat = FactureFormat(
    doc,
    additionalTableFacture as unknown as TableFunction,
  );

  additionalTableFactureFormat;
}
