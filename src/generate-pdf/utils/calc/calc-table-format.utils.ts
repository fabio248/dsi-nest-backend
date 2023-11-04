import { PDFDocument } from 'pdf-lib';
type TableFunction = (doc: PDFDocument) => void;

export async function formatTable(
  doc: any,
  table: TableFunction,
): Promise<void> {
  doc.table(table, {
    prepareHeader: () => doc.font('Helvetica-Bold').fontSize(13),
    // aumenta el tamaño del contenido de las celdas
    prepareRow: () => doc.font('Helvetica').fontSize(12),
    columnSize: [150, 300],
    layout: 'lightHorizontalLines',
    width: 530, // {Number} default: undefined // A4 595.28 x 841.89 (portrait) (about width sizes)
    x: 0, // {Number} default: undefined | To reset x position set "x: null"
    y: 0, // {Number} default: undefined |
    divider: {
      header: { disabled: false, width: 2, opacity: 1.5 },
      horizontal: { disabled: false, width: 0.5, opacity: 0.5 },
    },
    padding: 3,
    columnSpacing: 4,
    hideHeader: false,
    headerRows: 0, // Set the number of header rows to 0 to hide the header
    minRowHeight: 0,
  });
}
