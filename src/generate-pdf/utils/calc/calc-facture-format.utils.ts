import { PDFDocument } from 'pdf-lib';
type TableFunction = (doc: PDFDocument) => void;

export async function FactureFormat(
  doc: any,
  table: TableFunction,
): Promise<void> {
  doc.table(table, {
    prepareHeader: () => doc.font('Helvetica-Bold').fontSize(13),
    prepareRow: () => doc.font('Helvetica-Bold').fontSize(12),
    layout: 'lightHorizontalLines',
    width: 300,
    x: 300 - 20,
    y: 0,
    columnSpacing: 4,
    hideHeader: -1,
    align: 'right',
  });
}
